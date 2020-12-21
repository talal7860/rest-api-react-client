FROM node:14.15.3-alpine3.10 as base
WORKDIR /server
COPY . .
FROM base as prod
WORKDIR /server
ENV PORT=80
ENV NODE_ENV=production
RUN yarn install --prod
EXPOSE 80
CMD ["yarn", "start"]
