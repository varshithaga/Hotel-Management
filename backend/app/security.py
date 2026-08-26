import hashlib
import hmac
import os

_ITERATIONS = 260_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, hashed: str) -> bool:
    try:
        salt_hex, digest_hex = hashed.split("$")
    except ValueError:
        return False
    salt = bytes.fromhex(salt_hex)
    expected = bytes.fromhex(digest_hex)
    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return hmac.compare_digest(expected, actual)
