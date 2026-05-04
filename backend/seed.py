import os
import sys
from datetime import datetime, timedelta
import uuid
import bcrypt

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User, Tournament, Registration, Match


def create_seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"DB already has {existing_users} users. Skipping seed.")
            return

        print("Creating seed data...")

        password_hash = bcrypt.hashpw(b"password123", bcrypt.gensalt()).decode('utf-8')

        users_data = [
            {"email": "juan@test.com", "name": "Juan Pérez", "level": 5, "hand": "right"},
            {"email": "maria@test.com", "name": "María García", "level": 6, "hand": "left"},
            {"email": "pedro@test.com", "name": "Pedro López", "level": 4, "hand": "right"},
            {"email": "laura@test.com", "name": "Laura Fernández", "level": 7, "hand": "right"},
            {"email": "carlos@test.com", "name": "Carlos Rodríguez", "level": 5, "hand": "left"},
            {"email": "ana@test.com", "name": "Ana Martínez", "level": 6, "hand": "right"},
            {"email": "luis@test.com", "name": "Luis González", "level": 4, "hand": "right"},
            {"email": "sofia@test.com", "name": "Sofia Torres", "level": 8, "hand": "left"},
        ]

        users = []
        for u in users_data:
            user = User(
                id=str(uuid.uuid4()),
                email=u["email"],
                name=u["name"],
                password_hash=password_hash,
                level=u["level"],
                preferred_hand=u["hand"],
            )
            db.add(user)
            users.append(user)

        db.commit()
        print(f"Created {len(users)} users")

        start_date = datetime.now().date() + timedelta(days=7)
        end_date = start_date + timedelta(days=7)

        tournament = Tournament(
            id=str(uuid.uuid4()),
            name="Torneo de Verano 2026",
            description="Torneo open para todos los niveles. Vení a competir!",
            venue="Club de Tennis Buenos Aires",
            address="Av. Libertador 1234, Buenos Aires",
            start_date=start_date,
            end_date=end_date,
            category="open",
            format="singles",
            capacity=8,
            entry_fee=5000,
            organizer_id=users[0].id,
            status="open",
        )
        db.add(tournament)
        db.commit()

        print(f"Created tournament: {tournament.name}")

        for user in users:
            reg = Registration(
                id=str(uuid.uuid4()),
                tournament_id=tournament.id,
                user_id=user.id,
                status="confirmed",
            )
            db.add(reg)

        db.commit()
        print(f"Registered {len(users)} players")

        matches = []

        round1_times = [
            start_date + timedelta(days=1) + timedelta(hours=10),
            start_date + timedelta(days=1) + timedelta(hours=11),
            start_date + timedelta(days=1) + timedelta(hours=12),
            start_date + timedelta(days=1) + timedelta(hours=13),
        ]

        for i in range(0, 8, 2):
            match = Match(
                id=str(uuid.uuid4()),
                tournament_id=tournament.id,
                round="Octavos",
                player1_id=users[i].id,
                player2_id=users[i+1].id,
                court=f"Court {(i//2) + 1}",
                scheduled_at=round1_times[i//2],
                status="completed",
                winner_id=users[i].id,
                score={"score_string": "6-4, 6-3"},
            )
            matches.append(match)

        for i in range(0, 4, 2):
            match = Match(
                id=str(uuid.uuid4()),
                tournament_id=tournament.id,
                round="Cuartos",
                player1_id=matches[i].winner_id,
                player2_id=matches[i+1].winner_id,
                court=f"Court {(i//2) + 1}",
                scheduled_at=start_date + timedelta(days=3) + timedelta(hours=10 + i//2),
                status="in_progress",
            )
            matches.append(match)

        match = Match(
            id=str(uuid.uuid4()),
            tournament_id=tournament.id,
            round="Semifinal",
            player1_id=matches[4].winner_id,
            player2_id=matches[5].winner_id,
            court="Court 1",
            scheduled_at=start_date + timedelta(days=5) + timedelta(hours=11),
            status="scheduled",
        )
        matches.append(match)

        match = Match(
            id=str(uuid.uuid4()),
            tournament_id=tournament.id,
            round="Final",
            player1_id=None,
            player2_id=None,
            court="Court Central",
            scheduled_at=start_date + timedelta(days=7) + timedelta(hours=14),
            status="scheduled",
        )
        matches.append(match)

        for m in matches:
            db.add(m)

        db.commit()
        print(f"Created {len(matches)} matches")

        print("\n✅ Seed data created successfully!")
        print("\n📝 Test login:")
        print("   Email: juan@test.com")
        print("   Password: password123")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_seed_data()