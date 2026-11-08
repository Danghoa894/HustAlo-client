# HUSTALO Client — Quy tắc cho AI Agent

## Nguồn sự thật
- Spec chỉ nằm ở monorepo `HustAlo`: `../HustAlo/.spec/` (đổi bằng `HUSTALO_SERVER_DIR`). Đọc spec liên quan TRƯỚC khi code.
- Mọi đường dẫn `client/…` trong spec = đường dẫn tính từ gốc repo này (D-24), ví dụ `client/src/lib/api/http.ts` → `src/lib/api/http.ts`.
- Không tự đổi tech stack, tên event, enum, mã lỗi, hằng số. Nếu spec sai/thiếu: DỪNG LẠI, đề xuất sửa spec
  (PR vào `HustAlo`), chờ duyệt, rồi mới code.
- Enum, hằng số, Zod schema, kiểu event dùng chung đến từ `@hustalo/shared` (tarball GitHub Release của `HustAlo`,
  development_guide.md §2.7). Không chép hay khai báo lại hợp đồng trong repo này.
- `server.version` = SHA commit `HustAlo` dùng làm backend cho E2E.

## Quy trình mỗi tác vụ
1. Đọc spec liên quan + trích các ID (FR/AC/EC) sẽ xử lý.
2. Lập kế hoạch, liệt kê file sẽ tạo/sửa.
3. Viết test theo AC/EC trước, rồi code cho pass.
4. Chạy `npm run typecheck && npm run lint && npm test` — phải xanh mới báo xong.
5. Cập nhật Traceability Matrix (trong `HustAlo`) nếu thêm/đổi hành vi.

## Cấm
- Commit secret, log token/nội dung tin nhắn/SDP.
- Dùng `dangerouslySetInnerHTML` với dữ liệu người dùng.
- `skip`-based pagination cho lịch sử tin nhắn.

## Lệnh
- Backend (trong `../HustAlo`): `npm run infra:up`, `npm run db:indexes`, `npm run db:seed`, `npm run dev:server`
- Client: `npm run dev` | Test: `npm test` | E2E: `npm run test:e2e`
