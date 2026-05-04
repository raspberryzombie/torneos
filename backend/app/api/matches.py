from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

from app.database import get_db
from app.models import User, Match, Registration
from app.schemas.match import MatchResponse, MatchListResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/matches", tags=["matches"])


class ScoreReport(BaseModel):
    score: str
    winner_id: str

router = APIRouter(prefix="/api/matches", tags=["matches"])


@router.get("", response_model=MatchListResponse)
def get_my_matches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    upcoming_end = now + timedelta(days=7)

    matches_today = db.query(Match).filter(
        Match.scheduled_at >= today_start,
        Match.scheduled_at < today_end,
        (Match.player1_id == current_user.id) | (Match.player2_id == current_user.id),
        Match.status.in_(["scheduled", "in_progress"]),
    ).order_by(Match.scheduled_at).all()

    matches_upcoming = db.query(Match).filter(
        Match.scheduled_at >= today_end,
        Match.scheduled_at <= upcoming_end,
        (Match.player1_id == current_user.id) | (Match.player2_id == current_user.id),
        Match.status == "scheduled",
    ).order_by(Match.scheduled_at).all()

    registrations = db.query(Registration).filter(
        Registration.user_id == current_user.id,
        Registration.status == "confirmed",
    ).all()

    def build_match_response(match: Match) -> MatchResponse:
        opponent_id = None
        opponent_name = None
        
        if match.player1_id == current_user.id:
            opponent_id = match.player2_id
            opponent_name = match.player2.name if match.player2 else "TBD"
        elif match.player2_id == current_user.id:
            opponent_id = match.player1_id
            opponent_name = match.player1.name if match.player1 else "TBD"

        return MatchResponse(
            id=match.id,
            tournament_id=match.tournament_id,
            tournament_name=match.tournament.name if match.tournament else "Torneo",
            round=match.round,
            opponent_id=opponent_id,
            opponent_name=opponent_name,
            court=match.court,
            scheduled_at=match.scheduled_at,
            score=match.score,
            status=match.status,
        )

    today_response = [build_match_response(m) for m in matches_today]
    upcoming_response = [build_match_response(m) for m in matches_upcoming]

    registrations_response = []
    for reg in registrations:
        tournament = reg.tournament
        if tournament:
            registrations_response.append({
                "registration_id": reg.id,
                "tournament_id": tournament.id,
                "tournament_name": tournament.name,
                "venue": tournament.venue,
                "start_date": tournament.start_date,
            })

    return MatchListResponse(
        today=today_response,
        upcoming=upcoming_response,
        registrations=registrations_response,
    )


@router.get("/{match_id}", response_model=MatchResponse)
def get_match_detail(
    match_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partido no encontrado"
        )

    if match.player1_id != current_user.id and match.player2_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tenés acceso a este partido"
        )

    opponent_id = None
    opponent_name = None
    
    if match.player1_id == current_user.id:
        opponent_id = match.player2_id
        opponent_name = match.player2.name if match.player2 else "TBD"
    elif match.player2_id == current_user.id:
        opponent_id = match.player1_id
        opponent_name = match.player1.name if match.player1 else "TBD"

    return MatchResponse(
        id=match.id,
        tournament_id=match.tournament_id,
        tournament_name=match.tournament.name if match.tournament else "Torneo",
        round=match.round,
        opponent_id=opponent_id,
        opponent_name=opponent_name,
        court=match.court,
        scheduled_at=match.scheduled_at,
        score=match.score,
        status=match.status,
    )


@router.post("/{match_id}/score")
def report_score(
    match_id: str,
    score_data: ScoreReport,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partido no encontrado"
        )

    if match.player1_id != current_user.id and match.player2_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No formás parte de este partido"
        )

    if match.status not in ["scheduled", "in_progress"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No podés reportar un partido con status: {match.status}"
        )

    if score_data.winner_id not in [match.player1_id, match.player2_id]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ganador debe ser uno de los jugadores"
        )

    if score_data.winner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo el ganador puede reportar el score"
        )

    match.score = {"score_string": score_data.score, "winner_id": score_data.winner_id}
    match.status = "pending_confirmation"
    match.winner_id = score_data.winner_id
    db.commit()

    return {"success": True, "message": "Score reportado, esperando confirmación del oponente"}


@router.post("/{match_id}/confirm")
def confirm_result(
    match_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partido no encontrado"
        )

    if match.player1_id != current_user.id and match.player2_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No formás parte de este partido"
        )

    if match.status != "pending_confirmation":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hay score pendiente por confirmar"
        )

    match.status = "completed"
    db.commit()

    return {"success": True, "message": "Resultado confirmado"}


@router.post("/{match_id}/dispute")
def dispute_result(
    match_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partido no encontrado"
        )

    if match.player1_id != current_user.id and match.player2_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No formás parte de este partido"
        )

    if match.status != "pending_confirmation":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hay resultado por disputear"
        )

    match.status = "disputed"
    db.commit()

    return {"success": True, "message": "Resultado disputeado. Un administrador revisará el caso."}