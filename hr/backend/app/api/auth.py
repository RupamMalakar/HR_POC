from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserProfile
from app.api.deps import verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token({"sub": user.email, "role": user.role, "uid": user.id})
    refresh_token = create_access_token({"sub": user.email, "type": "refresh"})

    return TokenResponse(
        token=access_token,
        refreshToken=refresh_token,
        expiresIn=3600,
        user=UserProfile(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            title=user.title,
            avatarUrl=user.avatar_url
        )
    )

@router.get("/me", response_model=UserProfile)
def get_me(current_user: User = Depends(get_current_user)):
    return UserProfile(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        title=current_user.title,
        avatarUrl=current_user.avatar_url
    )
