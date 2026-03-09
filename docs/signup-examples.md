# Signup Request Body Examples

## Patient Signup
POST /users/signup
```json
{
  "fullName": "John Doe",
  "email": "patient@test.com",
  "password": "password123",
  "phone": "12345678",
  "gender": "MALE",
  "role": "PATIENT",
  "age": "30"
}
```

---

## Doctor Signup
POST /users/signup
```json
{
  "fullName": "Dr. Jane Smith",
  "email": "doctor@test.com",
  "password": "password123",
  "phone": "87654321",
  "gender": "FEMALE",
  "role": "DOCTOR",
  "speciality": "Cardiology",
  "bio": "Dr. Jane Smith is a highly experienced cardiologist with over 20 years of practice.",
  "licenseNumber": "1234/95"
}
```

---

## Admin Signup
POST /users/signup
```json
{
  "fullName": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "phone": "11223344",
  "gender": "OTHER",
  "role": "ADMIN"
}
```
> Note: `canModerate` is not included in the request body.
> It defaults to `false` and can only be set to `true` by another admin.
