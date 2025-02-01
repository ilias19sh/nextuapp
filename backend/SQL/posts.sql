CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    url_media VARCHAR(255) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE sondages (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE reponses (
    id SERIAL PRIMARY KEY,
    sondage_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    FOREIGN KEY (sondage_id) REFERENCES sondages(id) ON DELETE CASCADE
);

CREATE TABLE votes (
    user_id INT NOT NULL,
    reponse_id INT NOT NULL,
    PRIMARY KEY (user_id, reponse_id),
    FOREIGN KEY (reponse_id) REFERENCES reponses(id) ON DELETE CASCADE
);
