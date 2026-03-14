import pandas as pd
from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine
from app.models.models import Question, Base

# Create tables
Base.metadata.create_all(bind=engine)

def import_csv():
    db = SessionLocal()
    try:
        df = pd.read_csv("../Leetcode.csv")
        for _, row in df.iterrows():
            question = Question(
                topic=str(row.get("Category", row.get("category", "Algorithms"))),
                content=str(row.get("Title", row.get("title", "Unknown"))),
                difficulty=str(row.get("Difficulty", row.get("difficulty", "Easy")))
            )
            db.add(question)
        db.commit()
        print("Data imported successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import_csv()
