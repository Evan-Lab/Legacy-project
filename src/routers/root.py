from fastapi import APIRouter, Depends
from .context.common import common_context
    
root_router = APIRouter(
    dependencies=[Depends(common_context)]
)
