FROM node:24-alpine
WORKDIR /web
COPY web ./
RUN npm install
ENV PORT=5173
EXPOSE 5173
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port 5173"]
