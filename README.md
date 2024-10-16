
## TL;DR

```
docker compose up --build --force-recreate --renew-anon-volumes
```
and locally after
```
npx prisma migrate deploy;
npx prisma generate;
npx prisma db seed;
npm run dev;
```


## What was done

- updated `prisma/schema.prisma` to have `username` column in `User`
```
pnpx prisma migrate dev --name usertable_update
migrations/
  └─ 20241016110806_usertable_update/
    └─ migration.sql
```
- updated `prisma/schema.prisma` to have `description` column in `Report` (otherwise reports have no sense, right?)
```
pnpx prisma migrate dev --name reporttable_update
migrations/
  └─ 20241017120835_reporttable_update/
    └─ migration.sql
```
- updated `seeds.ts` to populate `username` column in `User` and `description` column in `Report`
- updated docker-compose to add necessary steps automatically
```
npx prisma migrate dev
npx prisma db seed
```
- added `Dashboard` component and used MUI for better looking UI
- IDs are clickable and lead to `Report` page
- added `Filter` components for `Tabs` and the following filters  
```
●-Status
● Severity
● ID (integers only)
● Hacker username or email address
● Report type
● Project
```
- API Key is kept in `.env`
- client API funcs are kept in `utils/API.js`
- updated `api/reports` to handle filters, sorting and API Key

