from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import json
import base64

from app.database import get_db
from app.models import User, Tournament, DelegateToken
from app.schemas.delegate import (
    DelegateQRCreate,
    DelegateQRResponse,
    DelegateSessionResponse,
    DelegateActivateRequest,
    DelegateActivateResponse,
)
from app.services.auth import get_current_user, create_access_token
from app.config import get_settings

router = APIRouter(prefix="/api", tags=["delegates"])
settings = get_settings()


def check_tournament_admin(tournament_id: str, user_id: str, db: Session) -> Tournament:
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Torneo no encontrado")
    if tournament.created_by != user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador puede realizar esta acción")
    return tournament


@router.post("/tournaments/{tournament_id}/delegate/qr", response_model=DelegateQRResponse)
def generate_delegate_qr(
    tournament_id: str,
    qr_options: DelegateQRCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_tournament_admin(tournament_id, current_user.id, db)

    token_id = str(datetime.utcnow().timestamp())
    expires_at = datetime.utcnow() + timedelta(hours=qr_options.hours_valid)

    permissions = ["view:tournament", "view:bracket", "view:matches", "create:results"]
    restrictions = ["no_edit_existing", "no_delete", "no_finalize", "no_manage_registrations"]

    token_data = {
        "tournament_id": tournament_id,
        "permissions": permissions,
        "restrictions": restrictions,
        "expires_at": expires_at.isoformat(),
        "single_use": qr_options.single_use,
        "created_by": current_user.id,
        "token_id": token_id
    }

    token_str = base64.b64encode(json.dumps(token_data).encode()).decode()

    delegate_token = DelegateToken(
        tournament_id=tournament_id,
        created_by=current_user.id,
        token=token_str,
        permissions=json.dumps(permissions),
        restrictions=json.dumps(restrictions),
        expires_at=expires_at,
        single_use=qr_options.single_use,
    )
    db.add(delegate_token)
    db.commit()

    return DelegateQRResponse(
        qr_code=token_str,
        token_id=delegate_token.id,
        expires_at=expires_at.isoformat(),
        single_use=qr_options.single_use
    )


@router.get("/tournaments/{tournament_id}/delegate/sessions", response_model=list[DelegateSessionResponse])
def list_delegate_sessions(
    tournament_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_tournament_admin(tournament_id, current_user.id, db)

    sessions = db.query(DelegateToken).filter(
        DelegateToken.tournament_id == tournament_id,
        DelegateToken.is_active == True,
        DelegateToken.expires_at > datetime.utcnow()
    ).all()

    result = []
    for session in sessions:
        creator = db.query(User).filter(User.id == session.created_by).first()
        activated_by_user = None
        if session.used_by:
            activated_by_user = db.query(User).filter(User.id == session.used_by).first()

        result.append(DelegateSessionResponse(
            id=session.id,
            tournament_id=session.tournament_id,
            created_by=session.created_by,
            created_by_name=creator.name if creator else None,
            activated_by=session.used_by,
            activated_by_name=activated_by_user.name if activated_by_user else None,
            expires_at=session.expires_at,
            is_active=session.is_active and not session.is_expired,
            created_at=session.created_at
        ))

    return result


@router.delete("/tournaments/{tournament_id}/delegate/sessions/{session_id}")
def revoke_delegate_session(
    tournament_id: str,
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    check_tournament_admin(tournament_id, current_user.id, db)

    session = db.query(DelegateToken).filter(
        DelegateToken.id == session_id,
        DelegateToken.tournament_id == tournament_id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    session.is_active = False
    db.commit()

    return {"success": True, "message": "Sesión revocada correctamente"}


@router.post("/auth/delegate/activate", response_model=DelegateActivateResponse)
def activate_delegate_session(
    request: DelegateActivateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        token_data_str = base64.b64decode(request.token.encode()).decode()
        token_data = json.loads(token_data_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Token inválido")

    token_id = token_data.get("token_id")
    tournament_id = token_data.get("tournament_id")

    delegate_token = db.query(DelegateToken).filter(
        DelegateToken.id == token_id,
        DelegateToken.tournament_id == tournament_id
    ).first()

    if not delegate_token:
        raise HTTPException(status_code=404, detail="Token no encontrado")

    if not delegate_token.is_valid:
        if delegate_token.is_expired:
            raise HTTPException(status_code=400, detail="Este código QR ha expirado")
        if delegate_token.used:
            raise HTTPException(status_code=400, detail="Este código QR ya fue utilizado")
        raise HTTPException(status_code=400, detail="Token inválido")

    if delegate_token.single_use:
        delegate_token.used = True
        delegate_token.used_by = current_user.id
        delegate_token.used_at = datetime.utcnow()

    db.commit()

    delegate_token.is_active = False
    db.commit()

    permissions = token_data.get("permissions", [])
    restrictions = token_data.get("restrictions", [])
    expires_at = token_data.get("expires_at")

    delegate_access_token = create_access_token(
        data={
            "sub": current_user.id,
            "delegate": True,
            "tournament_id": tournament_id,
            "permissions": permissions,
            "restrictions": restrictions
        },
        expires_delta=timedelta(hours=24)
    )

    return DelegateActivateResponse(
        access_token=delegate_access_token,
        permissions=permissions,
        restrictions=restrictions,
        tournament_id=tournament_id,
        expires_at=expires_at
    )


@router.post("/auth/delegate/deactivate")
def deactivate_delegate_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {"success": True, "message": "Sesión de editor finalizada"}