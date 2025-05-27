# import logging
# from fastapi import APIRouter, HTTPException, Request, Query
# from fastapi.responses import RedirectResponse
# from datetime import datetime, timedelta
# from app.services.linkedin_service import LinkedInService
# from app.database import connected_accounts_collection, users_collection
# from app.models.user import SocialPlatform, ConnectedAccount
# from bson import ObjectId
# import os
# from dotenv import load_dotenv
# import uuid
#
# load_dotenv()
#
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)  # Fix _name_ typo
#
# router = APIRouter()
# linkedin_service = LinkedInService()
#
# FRONTEND_REDIRECT_URI = os.getenv("FRONTEND_REDIRECT_URI")
#
# @router.get("/auth-url")
# async def get_linkedin_auth_url():
#     try:
#         state = str(uuid.uuid4())
#         auth_url = await linkedin_service.get_auth_url(state)
#         if not auth_url:
#             logger.error("LinkedInService.get_auth_url returned empty or invalid URL")
#             raise HTTPException(status_code=500, detail="Failed to generate LinkedIn auth URL: Empty URL returned")
#         logger.info(f"Generated LinkedIn auth URL with state: {state}")
#         return {"authUrl": auth_url, "state": state}
#     except Exception as e:
#         logger.error(f"Error generating LinkedIn auth URL: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to generate LinkedIn auth URL: {str(e)}")
#
# @router.get("/callback")
# async def linkedin_callback(
#     request: Request,
#     code: str = Query(...),
#     state: str = Query(None),
#     account_type: str = Query("personal")
# ):
#     try:
#         if not state:
#             raise HTTPException(status_code=400, detail="State parameter missing")
#
#         token_data = await linkedin_service.exchange_code_for_token(code)
#         access_token = token_data["access_token"]
#
#         profile_data = await linkedin_service.get_user_profile(access_token)
#
#         connected_account = {
#             "platform": SocialPlatform.LINKEDIN.value,
#             "name": profile_data.get("name", "LinkedIn User"),
#             "email": profile_data.get("email"),
#             "access_token": access_token,
#             "refresh_token": token_data.get("refresh_token"),
#             "expires_in": datetime.utcnow() + timedelta(seconds=token_data.get("expires_in", 3600)),
#             "account_id": profile_data.get("sub"),
#             "account_type": account_type,
#             "is_active": True,
#             "connected_at": datetime.utcnow(),
#             "user_id": ObjectId("current_user_id")  # Ensure user_id is stored
#         }
#
#         await connected_accounts_collection.update_one(
#             {
#                 "user_id": ObjectId("current_user_id"),
#                 "platform": SocialPlatform.LINKEDIN.value,
#                 "account_id": profile_data.get("sub")
#             },
#             {"$set": connected_account},
#             upsert=True
#         )
#
#         await users_collection.update_one(
#             {"_id": ObjectId("current_user_id")},
#             {"$addToSet": {"connected_accounts": connected_account}}
#         )
#
#         return RedirectResponse(url=f"{FRONTEND_REDIRECT_URI}?linkedin_connected=true")
#     except Exception as e:
#         logger.error(f"LinkedIn callback error: {str(e)}")
#         raise HTTPException(status_code=400, detail=f"LinkedIn authentication failed: {str(e)}")
#
# @router.get("/accounts")
# async def get_connected_accounts(user_id: str):
#     try:
#         accounts = await connected_accounts_collection.find(
#             {"user_id": ObjectId(user_id)}
#         ).to_list(None)
#
#         for account in accounts:
#             account["_id"] = str(account["_id"])
#             account["user_id"] = str(account["user_id"])
#
#         return {"accounts": accounts}
#     except Exception as e:
#         logger.error(f"Error fetching accounts: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))
#
# @router.delete("/accounts/{account_id}")
# async def disconnect_account(account_id: str):
#     try:
#         result = await connected_accounts_collection.delete_one({"_id": ObjectId(account_id)})
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Account not found")
#         return {"message": "Account disconnected successfully"}
#     except Exception as e:
#         logger.error(f"Error disconnecting account: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))
#
# @router.post("/post")
# async def post_to_linkedin(
#     user_id: str,
#     account_id: str,
#     content: str
# ):
#     try:
#         account = await connected_accounts_collection.find_one({
#             "user_id": ObjectId(user_id),
#             "account_id": account_id,
#             "platform": SocialPlatform.LINKEDIN.value
#         })
#
#         if not account:
#             raise HTTPException(status_code=404, detail="LinkedIn account not found")
#
#         if account["expires_in"] < datetime.utcnow():
#             new_tokens = await linkedin_service.refresh_token(account["refresh_token"])
#             if not new_tokens:
#                 raise HTTPException(status_code=401, detail="Token refresh failed")
#
#             update_data = {
#                 "access_token": new_tokens["access_token"],
#                 "expires_in": datetime.utcnow() + timedelta(seconds=new_tokens.get("expires_in", 3600))
#             }
#             if "refresh_token" in new_tokens:
#                 update_data["refresh_token"] = new_tokens["refresh_token"]
#
#             await connected_accounts_collection.update_one(
#                 {"_id": account["_id"]},
#                 {"$set": update_data}
#             )
#             access_token = new_tokens["access_token"]
#         else:
#             access_token = account["access_token"]
#
#         user_urn = f"urn:li:person:{account['account_id']}" if account["account_type"] == "personal" else f"urn:li:organization:{account['account_id']}"
#         post_id = await linkedin_service.create_post(access_token, user_urn, content)
#
#         return {"success": True, "post_id": post_id}
#     except Exception as e:
#         logger.error(f"Error posting to LinkedIn: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

import logging
from fastapi import APIRouter, HTTPException, Request, Query, Body
from fastapi.responses import RedirectResponse, JSONResponse
from datetime import datetime, timedelta
from app.services.linkedin_service import LinkedInService
from app.database import connected_accounts_collection, users_collection
from app.models.user import SocialPlatform, ConnectedAccount
from bson import ObjectId
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
linkedin_service = LinkedInService()

FRONTEND_REDIRECT_URI = os.getenv("FRONTEND_REDIRECT_URI")


@router.get("/auth-url")
async def get_linkedin_auth_url():
    try:
        logger.info("Generating LinkedIn auth URL")
        logger.info(f"Using client_id: {os.getenv('LINKEDIN_CLIENT_ID')}")
        logger.info(f"Using redirect_uri: {os.getenv('LINKEDIN_REDIRECT_URI')}")

        state = str(uuid.uuid4())
        auth_url = await linkedin_service.get_auth_url(state)
        if not auth_url:
            logger.error("LinkedInService.get_auth_url returned empty or invalid URL")
            raise HTTPException(status_code=500, detail="Failed to generate LinkedIn auth URL: Empty URL returned")
        logger.info(f"Generated LinkedIn auth URL with state: {state}")
        logger.info(f"Full auth URL: {auth_url}")
        return {"authUrl": auth_url, "state": state}
    except Exception as e:
        logger.error(f"Error generating LinkedIn auth URL: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate LinkedIn auth URL: {str(e)}")

@router.get("/callback", include_in_schema=False)
async def linkedin_callback(
        request: Request,
        code: str = Query(...),
        state: str = Query(None),
        account_type: str = Query("personal")
):
    try:
        # Validate state parameter (in a real app, compare with stored state)
        if not state:
            raise HTTPException(status_code=400, detail="State parameter missing")

        # Exchange code for tokens
        token_data = await linkedin_service.exchange_code_for_token(code)
        access_token = token_data["access_token"]
        refresh_token = token_data.get("refresh_token")
        expires_in = token_data.get("expires_in", 3600)

        # Get user profile
        profile_data = await linkedin_service.get_user_profile(access_token)
        logger.info(f"LinkedIn profile data: {profile_data}")

        # For testing, using 'current_user_id' as default
        # In production, you would get this from the authenticated user's session
        user_id = "current_user_id"

        # Create connected account data
        connected_account = {
            "platform": SocialPlatform.LINKEDIN.value,
            "name": profile_data.get("name", "LinkedIn User"),
            "email": profile_data.get("email"),
            "profile_picture": profile_data.get("picture"),
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_in": datetime.utcnow() + timedelta(seconds=expires_in),
            "account_id": profile_data.get("sub"),
            "account_type": account_type,
            "is_active": True,
            "connected_at": datetime.utcnow()
        }

        # Save or update the connection
        result = await connected_accounts_collection.update_one(
            {"user_id": user_id, "platform": SocialPlatform.LINKEDIN.value, "account_id": profile_data.get("sub")},
            {"$set": connected_account},
            upsert=True
        )

        logger.info(f"LinkedIn account saved/updated with result: {result.modified_count or result.upserted_id}")

        # Update user's connected accounts list if needed
        # Note: In this simplified version, we're just storing in connected_accounts_collection

        # Redirect back to frontend with success
        redirect_url = f"{FRONTEND_REDIRECT_URI}?linkedin_connected=true"
        logger.info(f"Redirecting to: {redirect_url}")
        return RedirectResponse(url=redirect_url)

    except Exception as e:
        logger.error(f"LinkedIn authentication error: {str(e)}")
        error_redirect = f"{FRONTEND_REDIRECT_URI}?linkedin_error={str(e)}"
        return RedirectResponse(url=error_redirect)


@router.get("/accounts")
async def get_connected_accounts(user_id: str = "current_user_id"):
    try:
        accounts = await connected_accounts_collection.find(
            {"user_id": user_id}
        ).to_list(None)

        # Convert ObjectId to string for JSON serialization
        for account in accounts:
            account["_id"] = str(account.get("_id", ""))
            account["user_id"] = str(account.get("user_id", ""))

        return {"accounts": accounts}
    except Exception as e:
        logger.error(f"Error fetching LinkedIn accounts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/post")
async def post_to_linkedin(
        data: dict = Body(...)
):
    try:
        user_id = data.get("user_id", "current_user_id")
        account_id = data.get("account_id")
        content = data.get("content")
        image_url = data.get("image_url")

        if not account_id:
            raise HTTPException(status_code=400, detail="account_id is required")
        if not content:
            raise HTTPException(status_code=400, detail="content is required")

        # Get the connected account
        account = await connected_accounts_collection.find_one({
            "user_id": user_id,
            "account_id": account_id,
            "platform": SocialPlatform.LINKEDIN.value
        })

        if not account:
            raise HTTPException(status_code=404, detail="LinkedIn account not found")

        # Check and refresh token if needed
        if account.get("expires_in") and datetime.fromisoformat(str(account["expires_in"])) < datetime.utcnow():
            if not account.get("refresh_token"):
                raise HTTPException(status_code=401,
                                    detail="No refresh token available. Please reconnect your LinkedIn account.")

            new_tokens = await linkedin_service.refresh_token(account["refresh_token"])
            if not new_tokens:
                raise HTTPException(status_code=401,
                                    detail="Token refresh failed. Please reconnect your LinkedIn account.")

            # Update tokens in database
            update_data = {
                "access_token": new_tokens["access_token"],
                "expires_in": datetime.utcnow() + timedelta(seconds=new_tokens.get("expires_in", 3600))
            }
            if "refresh_token" in new_tokens:
                update_data["refresh_token"] = new_tokens["refresh_token"]

            await connected_accounts_collection.update_one(
                {"_id": account["_id"]},
                {"$set": update_data}
            )
            access_token = new_tokens["access_token"]
        else:
            access_token = account["access_token"]

        # Determine user URN based on account type
        user_urn = f"urn:li:person:{account['account_id']}" if account[
                                                                   "account_type"] == "personal" else f"urn:li:organization:{account['account_id']}"

        # Post to LinkedIn
        post_id = await linkedin_service.create_post(access_token, user_urn, content, image_url)

        return {"success": True, "post_id": post_id}

    except Exception as e:
        logger.error(f"Error posting to LinkedIn: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
