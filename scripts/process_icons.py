from PIL import Image
import numpy as np
from collections import deque

def process(path, thresh=40):
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(int)
    is_black = (rgb.max(axis=2) <= thresh)
    visited = np.zeros((h, w), bool)
    dq = deque()
    # 네 변 가장자리에서 시작
    for x in range(w):
        for y in (0, h - 1):
            if is_black[y, x] and not visited[y, x]:
                dq.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if is_black[y, x] and not visited[y, x]:
                dq.append((y, x))
    # flood-fill: 연결된 외곽 검은 픽셀만 투명화
    while dq:
        y, x = dq.popleft()
        if visited[y, x] or not is_black[y, x]:
            continue
        visited[y, x] = True
        arr[y, x, 3] = 0
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and is_black[ny, nx]:
                dq.append((ny, nx))

    out = Image.fromarray(arr)
    # 투명 여백 잘라내기
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(path)
    removed = int(visited.sum())
    final_w, final_h = out.size
    print(f"  {path}: {w}x{h} -> {final_w}x{final_h}  ({removed:,} px 투명화)")

files = [
    "incense-1", "incense-2", "incense-3",
    "flower-1", "flower-2",
    "wheat", "egg", "crab", "soy", "milk",
]

for f in files:
    process(f"public/icons/{f}.png")

print("\n완료!")
