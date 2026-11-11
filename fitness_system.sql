CREATE SCHEMA IF NOT EXISTS fitness_studio;
USE fitness_studio;

 -- 1. Create Membership_Plan Table 
 CREATE TABLE Membership_Plan (
    plan_id INT PRIMARY KEY,
    Plan_name VARCHAR(50) NOT NULL,
    monthly_price DECIMAL (10, 2) NOT NULL,
    duration_months INT 
    ); 
    
INSERT INTO Membership_Plan VALUES (1, 'Basic', 30.00, 1);
INSERT INTO Membership_Plan VALUES (2, 'Standard', 50.00, 6);
INSERT INTO Membership_Plan VALUES (3, 'Premium', 80.00, 12);
    
-- 2. Create Trainer table (Parent)
CREATE TABLE Trainer (
    trainer_id INT PRIMARY KEY,
    t_firstname VARCHAR(50) NOT NULL,
    t_surname VARCHAR(50) NOT NULL,
    t_email VARCHAR(100) UNIQUE,
    t_contact VARCHAR(20),
    specialization VARCHAR(50),
    hire_date DATE
);

INSERT INTO Trainer VALUES (101, 'Alice', 'Smith', 'alice@gym.com', '555-0101', 'Yoga', '2023-01-15');
INSERT INTO Trainer VALUES (102, 'Bob', 'Johnson', 'bob@gym.com', '555-0102', 'HIIT', '2023-03-10');
INSERT INTO Trainer VALUES (103, 'Charlie', 'Davis', 'charlie@gym.com', '555-0103', 'Pilates', '2024-06-01');

CREATE INDEX idx_trainer_specialization ON Trainer (specialization);

-- 3. Create Member table (Links to Membership_Plan)
CREATE TABLE Member (
    member_id INT PRIMARY KEY,
    m_firstname VARCHAR(50) NOT NULL,
    m_surname VARCHAR(50) NOT NULL,
    m_email VARCHAR(100) UNIQUE,
    m_contact VARCHAR(20),
    join_date DATE,
    plan_id INT,
    FOREIGN KEY (plan_id) REFERENCES Membership_Plan(plan_id)
);

INSERT INTO Member VALUES (5001, 'Isabelle', 'Olson', 'isabelle@email.com', '410-562-8643', '2026-01-10', 1);
INSERT INTO Member VALUES (5002, 'Daphne', 'Morrison', 'daphne@email.com', '223-636-2238', '2026-02-15', 2);
INSERT INTO Member VALUES (5003, 'Ray', 'Green', 'ray@email.com', '440-731-6693', '2026-03-01', 3);

CREATE INDEX idx_member_name ON Member (m_surname, m_firstname);

-- 4. Create Fitness_Class table (Links to Trainer)
CREATE TABLE Fitness_Class (
    class_id INT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    class_time DATETIME,
    max_capacity INT CHECK (max_capacity > 0),
    current_enrolled INT DEFAULT 0,
    trainer_id INT,
    FOREIGN KEY (trainer_id) REFERENCES Trainer(trainer_id)
);

INSERT INTO Fitness_Class VALUES (10, 'Morning Yoga', '2026-06-03 08:00:00', 20, 0, 101);
INSERT INTO Fitness_Class VALUES (11, 'HIIT Blast', '2026-06-03 18:00:00', 15, 0, 102);
INSERT INTO Fitness_Class VALUES (12, 'Power Pilates', '2026-06-04 09:00:00', 10, 0, 103);

CREATE INDEX idx_class_name ON Fitness_Class (class_name);

-- 5. Create Booking table (Links Member and Fitness_Class)
CREATE TABLE Booking (
    booking_id INT PRIMARY KEY,
    member_id INT,
    class_id INT,
    booking_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('Confirmed', 'Cancelled')),
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (class_id) REFERENCES Fitness_Class(class_id)
);

INSERT INTO Booking (booking_id, member_id, class_id, status) VALUES (1, 5001, 10, 'Confirmed');
INSERT INTO Booking (booking_id, member_id, class_id, status) VALUES (2, 5002, 11, 'Confirmed');

CREATE INDEX idx_booking_member ON Booking (member_id);
CREATE INDEX idx_booking_class ON Booking (class_id);

-- 6. Create Payment_History table (Links to Member)
CREATE TABLE Payment_History (
    payment_id INT PRIMARY KEY,
    member_id INT,
    payment_date DATE,
    amount_paid DECIMAL(10, 2),
    payment_method VARCHAR(30),
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);

INSERT INTO Payment_History VALUES (9001, 5001, '2026-01-10', 30.00, 'Credit Card');
INSERT INTO Payment_History VALUES (9002, 5002, '2026-02-15', 50.00, 'Bank Transfer'); 