--User Table Create--
CREATE TABLE user (id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, responses INTEGER[], friends INTEGER[]);

--Response Table Create--
CREATE TABLE responses (id SERIAL PRIMARY KEY, user_id FOREIGN KEY REFERENCES user(id) response TEXT NOT NULL, image VARCHAR(255), anonymous BOOLEAN DEFAULT FALSE, date DATE DEFAULT CURRENT_DATE, likes INTEGER DEFAULT 0);

--Comment Table Create--
CREATE TABLE comment (id SERIAL PRIMARY KEY, response_id FOREIGN KEY REFERENCES response(id), comment_text TEXT NOT NULL, date DATE DEFAULT CURRENT_DATE )