from fastapi import APIRouter, Depends
from .context.base import base_context
from .context.common import common_context

base_router = APIRouter(
    prefix="/{base}", dependencies=[Depends(common_context), Depends(base_context)]
)
