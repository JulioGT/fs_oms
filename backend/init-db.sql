-- This script runs when the PostgreSQL container starts up
-- It creates the test database for running tests in isolation

CREATE DATABASE oms_test_db;
GRANT ALL PRIVILEGES ON DATABASE oms_test_db TO oms_user;
