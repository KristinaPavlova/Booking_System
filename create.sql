-- setup.sql

CREATE DATABASE IF NOT EXISTS car_wash;
USE car_wash;

CREATE TABLE IF NOT EXISTS Bookings (
    services TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME,
    totalAmount DECIMAL(10,2) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    PRIMARY KEY (startTime, address)
);


CREATE TABLE IF NOT EXISTS Hours (
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    PRIMARY KEY (startTime, endTime)
);


CREATE TABLE IF NOT EXISTS Service (
    Description TEXT NOT NULL,
    Category TEXT,
    Price TEXT NOT NULL
);



INSERT INTO Hours (startTime, endTime)
VALUES  
    ('2023-12-23 12:00:00', '2023-12-23 13:00:00'), 
    ('2023-12-23 14:00:00', '2023-12-23 15:00:00'),
    ('2023-12-24 12:00:00', '2023-12-24 13:00:00'),
    ('2023-12-24 10:00:00', '2023-12-24 11:00:00'),
    ('2023-12-24 12:00:00', '2023-12-24 13:00:00'),
    ('2023-12-24 14:00:00', '2023-12-24 15:00:00'),
    ('2023-12-24 16:00:00', '2023-12-24 17:00:00');


INSERT INTO Service (Description, Category, Price)
VALUES
    ('Външно измиване само със вода', 'Външно измиване', '10.00'),
    ('Външно измиване само със вода и специален препарат', 'Външно измиване', '20.00'),
    ('Външно измиване само със вода и специален препарат и полиране', 'Външно измиване', '30.00'),
    ('Вътрешно почистване с прахосмукачка', 'Вътрешно почистване', '10.00'),
    ('Вътрешно почистване с прахосмукачка и почистване на таблото', 'Вътрешно почистване', '15.00'),
    ('Вътрешно почистване с прахосмукачка и почистване на таблото + изпиране на тапицерията', 'Вътрешно почистване', '30.00');
