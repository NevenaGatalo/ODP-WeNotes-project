CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    korisnickoIme VARCHAR(50) UNIQUE NOT NULL,
    uloga VARCHAR(15) NOT NULL,
    lozinka VARCHAR(500) NOT NULL
);

CREATE TABLE notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    content VARCHAR(500) NOT NULL,
    image_url VARCHAR(500),
    is_pinned BOOLEAN DEFAULT FALSE,
    owner_id INT NOT NULL,
    share_guid VARCHAR(500),  -- nova kolona za GUID link
    CONSTRAINT fk_owner
        FOREIGN KEY (owner_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
);


INSERT INTO notes (title, content, image_url, is_pinned, owner_id, share_guid)
VALUES
('Prva beleška', 'Ovo je sadržaj prve beleške', NULL, FALSE, 1, NULL),
('Druga beleška', 'Ovo je sadržaj druge beleške', NULL, TRUE, 1, NULL),
('Treća beleška', 'Ovo je sadržaj treće beleške', NULL, FALSE, 1, NULL);

select*from notes;
select*from users;
