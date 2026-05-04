from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date, timedelta

from app.database import get_db
from app.models import User, Tournament, Registration, Match
from app.schemas.tournament import (
    TournamentResponse,
    TournamentListResponse,
    TournamentCreate,
    RegistrationResponse,
)
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/tournaments", tags=["tournaments"])


@router.get("", response_model=list[TournamentListResponse])
def list_tournaments(
    location: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    start_date_from: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    query = db.query(Tournament).filter(Tournament.status == "open")

    if location:
        query = query.filter(Tournament.venue.ilike(f"%{location}%"))
    
    if category:
        query = query.filter(Tournament.category == category)
    
    if start_date_from:
        query = query.filter(Tournament.start_date >= start_date_from)
    else:
        query = query.filter(Tournament.start_date >= date.today())

    tournaments = query.order_by(Tournament.start_date).all()

    user_id = current_user.id if current_user else None
    result = []
    for t in tournaments:
        registered_count = db.query(Registration).filter(
            Registration.tournament_id == t.id,
            Registration.status == "confirmed"
        ).count()
        
        is_registered = False
        if user_id:
            existing = db.query(Registration).filter(
                Registration.tournament_id == t.id,
                Registration.user_id == user_id,
                Registration.status == "confirmed"
            ).first()
            is_registered = bool(existing)

        result.append(TournamentListResponse(
            id=t.id,
            name=t.name,
            venue=t.venue,
            start_date=t.start_date,
            category=t.category,
            format=t.format,
            capacity=t.capacity,
            entry_fee=t.entry_fee,
            status=t.status,
            registered_count=registered_count,
            is_registered=is_registered,
        ))
    
    return result


@router.get("/{tournament_id}", response_model=TournamentResponse)
def get_tournament(
    tournament_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Torneo no encontrado"
        )

    registered_count = db.query(Registration).filter(
        Registration.tournament_id == tournament.id,
        Registration.status == "confirmed"
    ).count()

    is_registered = False
    if current_user:
        existing = db.query(Registration).filter(
            Registration.tournament_id == tournament.id,
            Registration.user_id == current_user.id,
            Registration.status == "confirmed"
        ).first()
        is_registered = bool(existing)

    organizer_name = None
    if tournament.organizer:
        organizer_name = tournament.organizer.name

    return TournamentResponse(
        id=tournament.id,
        name=tournament.name,
        description=tournament.description,
        organizer_id=tournament.organizer_id,
        organizer_name=organizer_name,
        venue=tournament.venue,
        address=tournament.address,
        start_date=tournament.start_date,
        end_date=tournament.end_date,
        category=tournament.category,
        format=tournament.format,
        capacity=tournament.capacity,
        entry_fee=tournament.entry_fee,
        status=tournament.status,
        created_at=tournament.created_at,
        registered_count=registered_count,
        is_registered=is_registered,
    )


@router.post("/{tournament_id}/register", response_model=RegistrationResponse)
def register_tournament(
    tournament_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Torneo no encontrado"
        )

    if tournament.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Torneo cancelado"
        )

    if tournament.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Torneo ya terminado"
        )

    registered_count = db.query(Registration).filter(
        Registration.tournament_id == tournament.id,
        Registration.status == "confirmed"
    ).count()

    if registered_count >= tournament.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Torneo completo"
        )

    existing = db.query(Registration).filter(
        Registration.tournament_id == tournament.id,
        Registration.user_id == current_user.id,
        Registration.status == "confirmed"
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya estás registrado en este torneo"
        )

    registration = Registration(
        tournament_id=tournament_id,
        user_id=current_user.id,
        status="confirmed",
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)

    return registration


@router.delete("/{tournament_id}/register")
def cancel_registration(
    tournament_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Torneo no encontrado"
        )

    if tournament.start_date <= date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes cancelar un torneo que ya empezó"
        )

    registration = db.query(Registration).filter(
        Registration.tournament_id == tournament_id,
        Registration.user_id == current_user.id,
        Registration.status == "confirmed"
    ).first()

    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No estás registrado en este torneo"
        )

    registration.status = "cancelled"
    db.commit()

    return {"success": True, "message": "Inscripción cancelada"}


@router.get("/registrations/me", response_model=list[dict])
def my_registrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    registrations = db.query(Registration).filter(
        Registration.user_id == current_user.id,
        Registration.status == "confirmed"
    ).all()

    result = []
    for reg in registrations:
        tournament = reg.tournament
        result.append({
            "registration_id": reg.id,
            "tournament_id": tournament.id,
            "tournament_name": tournament.name,
            "venue": tournament.venue,
            "start_date": tournament.start_date,
            "end_date": tournament.end_date,
            "category": tournament.category,
            "format": tournament.format,
            "registered_at": reg.registered_at,
        })
    
    return result


@router.post("", response_model=TournamentResponse)
def create_tournament(
    tournament_data: TournamentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if tournament_data.end_date < tournament_data.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La fecha de fin debe ser posterior a la de inicio"
        )

    if tournament_data.capacity < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El cupo debe ser al menos 2 jugadores"
        )

    tournament = Tournament(
        name=tournament_data.name,
        description=tournament_data.description,
        venue=tournament_data.venue,
        address=tournament_data.address,
        start_date=tournament_data.start_date,
        end_date=tournament_data.end_date,
        category=tournament_data.category,
        format=tournament_data.format,
        capacity=tournament_data.capacity,
        entry_fee=tournament_data.entry_fee,
        organizer_id=current_user.id,
        status="open",
    )
    db.add(tournament)
    db.commit()
    db.refresh(tournament)

    return TournamentResponse(
        id=tournament.id,
        name=tournament.name,
        description=tournament.description,
        organizer_id=tournament.organizer_id,
        organizer_name=current_user.name,
        venue=tournament.venue,
        address=tournament.address,
        start_date=tournament.start_date,
        end_date=tournament.end_date,
        category=tournament.category,
        format=tournament.format,
        capacity=tournament.capacity,
        entry_fee=tournament.entry_fee,
        status=tournament.status,
        created_at=tournament.created_at,
        registered_count=0,
        is_registered=False,
    )


@router.get("/me", response_model=list[TournamentListResponse])
def get_my_tournaments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tournaments = db.query(Tournament).filter(
        Tournament.organizer_id == current_user.id
    ).order_by(Tournament.created_at.desc()).all()

    result = []
    for t in tournaments:
        registered_count = db.query(Registration).filter(
            Registration.tournament_id == t.id,
            Registration.status == "confirmed"
        ).count()

        result.append(TournamentListResponse(
            id=t.id,
            name=t.name,
            venue=t.venue,
            start_date=t.start_date,
            category=t.category,
            format=t.format,
            capacity=t.capacity,
            entry_fee=t.entry_fee,
            status=t.status,
            registered_count=registered_count,
            is_registered=False,
        ))
    
    return result


@router.put("/{tournament_id}", response_model=TournamentResponse)
def update_tournament(
    tournament_id: str,
    tournament_data: TournamentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Torneo no encontrado"
        )

    if tournament.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tenés permiso para editar este torneo"
        )

    if tournament.start_date <= date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No podés editar un torneo que ya empezó"
        )

    if tournament_data.end_date < tournament_data.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La fecha de fin debe ser posterior a la de inicio"
        )

    tournament.name = tournament_data.name
    tournament.description = tournament_data.description
    tournament.venue = tournament_data.venue
    tournament.address = tournament_data.address
    tournament.start_date = tournament_data.start_date
    tournament.end_date = tournament_data.end_date
    tournament.category = tournament_data.category
    tournament.format = tournament_data.format
    tournament.capacity = tournament_data.capacity
    tournament.entry_fee = tournament_data.entry_fee

    db.commit()
    db.refresh(tournament)

    registered_count = db.query(Registration).filter(
        Registration.tournament_id == tournament.id,
        Registration.status == "confirmed"
    ).count()

    return TournamentResponse(
        id=tournament.id,
        name=tournament.name,
        description=tournament.description,
        organizer_id=tournament.organizer_id,
        organizer_name=current_user.name,
        venue=tournament.venue,
        address=tournament.address,
        start_date=tournament.start_date,
        end_date=tournament.end_date,
        category=tournament.category,
        format=tournament.format,
        capacity=tournament.capacity,
        entry_fee=tournament.entry_fee,
        status=tournament.status,
        created_at=tournament.created_at,
        registered_count=registered_count,
        is_registered=False,
    )


@router.delete("/{tournament_id}")
def delete_tournament(
    tournament_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Torneo no encontrado"
        )

    if tournament.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tenés permiso para cancelar este torneo"
        )

    if tournament.start_date <= date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No podés cancelar un torneo que ya empezó"
        )

    tournament.status = "cancelled"

    registrations = db.query(Registration).filter(
        Registration.tournament_id == tournament_id,
        Registration.status == "confirmed"
    ).all()
    for reg in registrations:
        reg.status = "cancelled"

    db.commit()

    return {"success": True, "message": "Torneo cancelado"}


@router.get("/{tournament_id}/matches")
def get_tournament_matches(
    tournament_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Torneo no encontrado"
        )

    matches = db.query(Match).filter(
        Match.tournament_id == tournament_id
    ).order_by(Match.scheduled_at).all()

    round_order = ['Octavos', 'Cuartos', 'Semifinal', 'Final', 'Tercer Puesto']
    
    rounds_dict = {}
    for match in matches:
        round_name = match.round or 'Ronda'
        if round_name not in rounds_dict:
            rounds_dict[round_name] = []
        
        player1_name = match.player1.name if match.player1 else "TBD"
        player2_name = match.player2.name if match.player2 else "TBD"
        winner_name = None
        if match.winner_id and match.winner:
            winner_name = match.winner.name
        
        rounds_dict[round_name].append({
            "id": match.id,
            "player1": player1_name,
            "player2": player2_name,
            "winner": winner_name,
            "status": match.status,
            "score": match.score.get("score_string") if match.score else None,
        })

    rounds = []
    for round_name in round_order:
        if round_name in rounds_dict:
            rounds.append({
                "name": round_name,
                "matches": rounds_dict[round_name]
            })
    
    for round_name, matches_list in rounds_dict.items():
        if round_name not in round_order:
            rounds.append({
                "name": round_name,
                "matches": matches_list
            })

    return {
        "tournament_id": tournament_id,
        "tournament_name": tournament.name,
        "rounds": rounds
    }