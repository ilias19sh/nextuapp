CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    birthday DATE NOT NULL,
    entrance_date DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(),
);


CREATE TABLE student (
    users_id INT PRIMARY KEY,
    student_number VARCHAR(100) UNIQUE NOT NULL,
    school VARCHAR(255) NOT NULL,
    year INT NOT NULL,
	type VARCHAR[],
    FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE admin (
    users_id INT PRIMARY KEY,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    job VARCHAR(255) NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);
