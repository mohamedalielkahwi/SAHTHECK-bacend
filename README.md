# NestJS Server Template

A ready-to-use NestJS server template with common configurations for building scalable APIs.

## Features

- **NestJS Framework**: Progressive Node.js framework
- **TypeORM**: Database ORM with PostgreSQL support
- **JWT Authentication**: Passport JWT strategy
- **Swagger Documentation**: Auto-generated API docs
- **Docker Support**: Pre-configured docker-compose with PostgreSQL, MinIO, Redis, MailDev, and Adminer
- **Validation**: Class-validator and class-transformer
- **Migrations**: TypeORM migrations support
- **Testing**: Jest setup for unit and e2e tests

## Quick Start

1. **Clone or copy this template**

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. **Start Docker services**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   pnpm run migration:run
   ```

6. **Start the development server**
   ```bash
   pnpm run start:dev
   ```

7. **Access the application**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api
   - Adminer (DB Admin): http://localhost:8080
   - MailDev: http://localhost:1080
   - MinIO Console: http://localhost:9001

## Available Scripts

- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run build` - Build the application
- `pnpm run start:prod` - Start production server
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm run migration:generate` - Generate new migration
- `pnpm run migration:run` - Run pending migrations
- `pnpm run migration:revert` - Revert last migration
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier

## Project Structure

```
src/
├── app.controller.ts      # Main app controller
├── app.module.ts          # Root module
├── app.service.ts         # Main app service
├── database/
│   ├── data-source.ts     # TypeORM data source config
│   └── migrations/        # Database migrations
├── main.ts                # Application entry point
└── test/                  # Test files
```

## Docker Services

- **PostgreSQL**: Database server
- **MinIO**: Object storage server
- **Redis**: In-memory data store
- **MailDev**: Email testing tool
- **Adminer**: Database management UI

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Run `pnpm run lint` and `pnpm run test` before committing
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
