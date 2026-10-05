"""Generate a profile GLB with Microsoft's official TRELLIS.2 Space.

Install ``gradio_client`` in a virtual environment, then run this file from
any directory. Hugging Face ZeroGPU quota may prevent GLB extraction even when
the preview succeeds. The generation and extraction must use the same client
session, so a failed extraction requires a fresh generation on the next run.
"""

from __future__ import annotations

import argparse
import os
import shutil
from pathlib import Path

from gradio_client import Client, handle_file
from huggingface_hub import get_token


ROOT = Path(__file__).resolve().parents[1]
SPACE = "https://microsoft-trellis-2.hf.space"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--image", type=Path, default=ROOT / "images/profile.png")
    parser.add_argument(
        "--output", type=Path, default=ROOT / "assets/profile-3d/profile_trellis2.glb"
    )
    parser.add_argument("--resolution", choices=("512", "1024", "1536"), default="1024")
    parser.add_argument("--seed", type=int, default=0)
    args = parser.parse_args()

    image = args.image.expanduser().resolve()
    if not image.is_file():
        parser.error(f"Input image not found: {image}")

    token = os.getenv("HF_TOKEN") or os.getenv("HUGGING_FACE_HUB_TOKEN") or get_token()
    client = Client(SPACE, token=token, verbose=False)

    print("Generating TRELLIS.2 3D preview...")
    client.predict(
        handle_file(str(image)),
        args.seed,
        args.resolution,
        7.5, 0.7, 12, 5.0,  # sparse structure
        7.5, 0.5, 12, 3.0,  # shape latent
        1.0, 0.0, 12, 3.0,  # texture latent
        api_name="/image_to_3d",
    )

    print("Extracting textured GLB...")
    result = client.predict(100000, 1024, api_name="/extract_glb")
    downloaded = Path(result[1])
    if not downloaded.is_file():
        raise RuntimeError("The Space did not return a GLB file")
    with downloaded.open("rb") as glb_file:
        magic = glb_file.read(4)
    if magic != b"glTF":
        raise RuntimeError("The Space did not return a valid binary GLB")

    output = args.output.expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(downloaded, output)
    print(f"Saved {output} ({output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
