# PAKE-Man
42 ft_transcendence project

To launch the live server (in order to make modifications in real time)

```bash
docker build -t pong-game .
docker run -p 5173:5173 -v $(pwd):/app pong-game
```

On mac:

```bash
docker build -t pong-game .
docker run \
  -it --rm \
  -v "$PWD":/app \
  -v /app/node_modules \
  -p 5173:5173 \
  pong-game
  ```
