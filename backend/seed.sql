-- Run this once after first launch to create the admin account
-- Login: admin@storerate.com / Admin@123
-- (bcrypt hash of "Admin@123", 10 rounds)

INSERT INTO users (id, name, email, password, address, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'System Administrator Account',
  'admin@storerate.com',
  '$2b$10$eImiTXuWVxfM37uY4JANjQ9gT1XVrCJBnOXz6BHZhT3.RMpF1t1uy',
  '123 Admin Headquarters, Platform City, ST 00001',
  'admin',
  NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;
