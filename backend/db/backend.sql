-- for help  \?
-- create database backend
-- list seleuruh table \d

CREATE TABLE reviews (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    restoran_id BIGINT NOT NULL REFERENCES restoran(id),
    name VARCHAR(50) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL check(
        rating >= 1
        and rating <= 5
    )
);
select *
from restoran
    left join(
        select restoran_id,
            count(*),
            TRUNC(AVG(rating, 1)) as average_rating
        from reviews
        group by restoran_id
    ) reviews on restoran.id = reviews.restoran_id;