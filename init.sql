-- ============================================
-- Movie Recommendation Website Database Schema
-- ============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS recommend_me_a_movie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recommend_me_a_movie;

-- ============================================
-- Table: accounts
-- Stores user account information
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    emailAddress VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    attempts INT DEFAULT 0,
    bannedTime BIGINT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (userName),
    INDEX idx_email (emailAddress)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: country
-- Stores user's selected country preference
-- ============================================
CREATE TABLE IF NOT EXISTS country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    country VARCHAR(50) NOT NULL DEFAULT 'uk',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userName) REFERENCES accounts(userName) ON DELETE CASCADE,
    INDEX idx_username (userName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: streamingServices
-- Stores which streaming services the user owns
-- ============================================
CREATE TABLE IF NOT EXISTS streamingServices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    netflix VARCHAR(10) DEFAULT '',
    disneyPlus VARCHAR(10) DEFAULT '',
    amazonPrime VARCHAR(10) DEFAULT '',
    nowTv VARCHAR(10) DEFAULT '',
    appleTvPlus VARCHAR(10) DEFAULT '',
    peacock VARCHAR(10) DEFAULT '',
    max VARCHAR(10) DEFAULT '',
    hulu VARCHAR(10) DEFAULT '',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userName) REFERENCES accounts(userName) ON DELETE CASCADE,
    INDEX idx_username (userName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: favouriteGenres
-- Stores user's favorite movie/TV genres
-- ============================================
CREATE TABLE IF NOT EXISTS favouriteGenres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    action VARCHAR(10) DEFAULT '',
    comedy VARCHAR(10) DEFAULT '',
    drama VARCHAR(10) DEFAULT '',
    adventure VARCHAR(10) DEFAULT '',
    thriller VARCHAR(10) DEFAULT '',
    crime VARCHAR(10) DEFAULT '',
    romance VARCHAR(10) DEFAULT '',
    scienceFiction VARCHAR(10) DEFAULT '',
    fantasy VARCHAR(10) DEFAULT '',
    family VARCHAR(10) DEFAULT '',
    mystery VARCHAR(10) DEFAULT '',
    biography VARCHAR(10) DEFAULT '',
    history VARCHAR(10) DEFAULT '',
    animation VARCHAR(10) DEFAULT '',
    music VARCHAR(10) DEFAULT '',
    sport VARCHAR(10) DEFAULT '',
    superhero VARCHAR(10) DEFAULT '',
    western VARCHAR(10) DEFAULT '',
    war VARCHAR(10) DEFAULT '',
    horror VARCHAR(10) DEFAULT '',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userName) REFERENCES accounts(userName) ON DELETE CASCADE,
    INDEX idx_username (userName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: leastFavouriteGenres
-- Stores user's least favorite genres (3 selections)
-- ============================================
CREATE TABLE IF NOT EXISTS leastFavouriteGenres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    action VARCHAR(10) DEFAULT '',
    comedy VARCHAR(10) DEFAULT '',
    drama VARCHAR(10) DEFAULT '',
    adventure VARCHAR(10) DEFAULT '',
    thriller VARCHAR(10) DEFAULT '',
    crime VARCHAR(10) DEFAULT '',
    romance VARCHAR(10) DEFAULT '',
    scienceFiction VARCHAR(10) DEFAULT '',
    fantasy VARCHAR(10) DEFAULT '',
    family VARCHAR(10) DEFAULT '',
    mystery VARCHAR(10) DEFAULT '',
    biography VARCHAR(10) DEFAULT '',
    history VARCHAR(10) DEFAULT '',
    animation VARCHAR(10) DEFAULT '',
    music VARCHAR(10) DEFAULT '',
    sport VARCHAR(10) DEFAULT '',
    superhero VARCHAR(10) DEFAULT '',
    western VARCHAR(10) DEFAULT '',
    war VARCHAR(10) DEFAULT '',
    horror VARCHAR(10) DEFAULT '',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userName) REFERENCES accounts(userName) ON DELETE CASCADE,
    INDEX idx_username (userName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: movieAge
-- Stores user's preference for movie release year
-- ============================================
CREATE TABLE IF NOT EXISTS movieAge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    preference INT NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userName) REFERENCES accounts(userName) ON DELETE CASCADE,
    INDEX idx_username (userName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: suitableAgeRatings
-- Stores user's acceptable age rating limit
-- ============================================
CREATE TABLE IF NOT EXISTS suitableAgeRatings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    preference INT NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userName) REFERENCES accounts(userName) ON DELETE CASCADE,
    INDEX idx_username (userName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: indexNum
-- Tracks the current recommendation index for each user
-- ============================================
CREATE TABLE IF NOT EXISTS indexNum (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    movieIndex1 INT DEFAULT 0,
    movieIndex2 INT DEFAULT 0,
    tvIndex1 INT DEFAULT 0,
    tvIndex2 INT DEFAULT 0,
    bothIndex1 INT DEFAULT 0,
    bothIndex2 INT DEFAULT 0,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userName) REFERENCES accounts(userName) ON DELETE CASCADE,
    INDEX idx_username (userName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: moviesAndTvShows
-- Stores all movies and TV shows available for recommendation
-- ============================================
CREATE TABLE IF NOT EXISTS moviesAndTvShows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    poster VARCHAR(500),
    synopsis TEXT,
    availableOn VARCHAR(255),
    imdb DECIMAL(3,1),
    ageRating INT,
    genres VARCHAR(255),
    length VARCHAR(50),
    yearReleased INT,
    trailer VARCHAR(500),
    link VARCHAR(500),
    type VARCHAR(20) NOT NULL, -- 'Movie' or 'TVShow'
    country VARCHAR(50) NOT NULL, -- 'uk' or 'us'
    
    -- Streaming Services
    netflix VARCHAR(10) DEFAULT '',
    disneyPlus VARCHAR(10) DEFAULT '',
    amazonPrime VARCHAR(10) DEFAULT '',
    nowTv VARCHAR(10) DEFAULT '',
    appleTvPlus VARCHAR(10) DEFAULT '',
    peacock VARCHAR(10) DEFAULT '',
    hulu VARCHAR(10) DEFAULT '',
    max VARCHAR(10) DEFAULT '',
    
    -- Genre flags
    action VARCHAR(10) DEFAULT '',
    comedy VARCHAR(10) DEFAULT '',
    drama VARCHAR(10) DEFAULT '',
    adventure VARCHAR(10) DEFAULT '',
    thriller VARCHAR(10) DEFAULT '',
    crime VARCHAR(10) DEFAULT '',
    romance VARCHAR(10) DEFAULT '',
    scienceFiction VARCHAR(10) DEFAULT '',
    fantasy VARCHAR(10) DEFAULT '',
    family VARCHAR(10) DEFAULT '',
    mystery VARCHAR(10) DEFAULT '',
    biography VARCHAR(10) DEFAULT '',
    history VARCHAR(10) DEFAULT '',
    animation VARCHAR(10) DEFAULT '',
    music VARCHAR(10) DEFAULT '',
    sport VARCHAR(10) DEFAULT '',
    superhero VARCHAR(10) DEFAULT '',
    western VARCHAR(10) DEFAULT '',
    war VARCHAR(10) DEFAULT '',
    horror VARCHAR(10) DEFAULT '',
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_country (country),
    INDEX idx_imdb (imdb),
    INDEX idx_yearReleased (yearReleased),
    INDEX idx_ageRating (ageRating),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `moviesAndTvShows` (`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (1,'Black Mirror','https://image.tmdb.org/t/p/w500/5UaYsGZOFhjFDwQh6GuLjjA7W6Z.jpg','Dark stories exploring the unintended consequences of technology.','Netflix',8.7,15,'Drama, Science Fiction','60m',2011,'https://www.youtube.com/watch?v=jDiYGjp5iFg','TV Show','uk','on','','','','','','','','','','on','','','','','on','','','','','','','','','','','','','2026-01-02 14:22:14','2026-01-02 14:22:14');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (2,'Sherlock','https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg','A modern update finds Holmes solving crimes in London.','Netflix',9.1,12,'Crime, Mystery, Drama','90m',2010,'https://www.youtube.com/watch?v=IrBKwzL3K7s','TV Show','uk','on','','','','','','','','','','on','','','on','','','','','on','','','','','','','','','','2026-01-02 14:22:22','2026-01-02 14:22:22');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (3,'1917','https://image.tmdb.org/t/p/w500/iZf0KyrE25z1sage4SYFLCCrMi9.jpg','Two soldiers race against time during World War I.','Amazon Prime Video',8.3,15,'War, Drama, History','119m',2019,'https://www.youtube.com/watch?v=YqNYrYUiMfg','Movie','uk','','','on','','','','','','','','on','','','','','','','','','','on','','','','','','on','','2026-01-02 14:22:30','2026-01-02 14:22:30');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (4,'Paddington','https://media.themoviedb.org/t/p/w440_and_h660_face/wpchRGhRhvhtU083PfX2yixXtiw.jpg','A bear from Peru finds a home in London.','Netflix',7.3,0,'Family, Comedy, Adventure','95m',2014,'https://www.youtube.com/watch?v=7bZFr2IA0Bo','Movie','uk','on','','','','','','','','','on','','on','','','','','','on','','','','','','','','','','','2026-01-02 14:22:48','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (5,'Breaking Bad','https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg','A chemistry teacher turns to crime after a terminal diagnosis.','Netflix',9.5,18,'Crime, Drama','47m',2008,'https://www.youtube.com/watch?v=HhesaQXLuRY','TV Show','us','on','','','','','','','','','','on','','','on','','','','','','','','','','','','','','','2026-01-02 14:22:57','2026-01-02 14:22:57');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (6,'The Office','https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg','A mockumentary about office workers in Scranton.','Disney+',9.0,12,'Comedy','22m',2005,'https://www.youtube.com/watch?v=tNcDHWpselE','TV Show','uk','','on','','','','','','','','on','','','','','','','','','','','','','','','','','','','2026-01-02 14:32:24','2026-01-02 14:32:24');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (7,'The Office','https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg','A mockumentary about office workers in Scranton.','Peacock',9.0,12,'Comedy','22m',2005,'https://www.youtube.com/watch?v=tNcDHWpselE','TV Show','us','','','','','','on','','','','on','','','','','','','','','','','','','','','','','','','2026-01-02 14:32:34','2026-01-02 14:32:34');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (8,'Inception','https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg','A thief steals information by infiltrating dreams.','Netflix',8.8,12,'Action, Science Fiction','148m',2010,'https://www.youtube.com/watch?v=YoHD9XEInc0','Movie','uk','on','','','','','','','','on','','','','','','','on','','','','','','','','','','','','','2026-01-02 14:32:42','2026-01-02 14:32:42');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (9,'Inception','https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg','A thief steals information by infiltrating dreams.','Amazon Prime Video',8.8,12,'Action, Science Fiction','148m',2010,'https://www.youtube.com/watch?v=YoHD9XEInc0','Movie','us','','','on','','','','','','on','','','','','','','on','','','','','','','','','','','','','2026-01-02 14:32:57','2026-01-02 14:32:57');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (11,'Better Call Saul','https://image.tmdb.org/t/p/w500/iBf0e6rYF2GxvY6G6XzWjzZ8zQF.jpg','The transformation of Jimmy McGill into Saul Goodman.','Netflix',8.9,15,'Crime, Drama','47m',2015,'https://www.youtube.com/watch?v=HN4oydykJFc','TV Show','us','on','','','','','','','','','','on','','','on','','','','','','','','','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (14,'Peaky Blinders','https://image.tmdb.org/t/p/w500/ilXkHuF1gU2JH7m1b2fZyGz7XkD.jpg','A gangster family epic set in post-war Birmingham.','Netflix',8.8,18,'Crime, Drama','60m',2013,'https://www.youtube.com/watch?v=oVzVdvGIC7U','TV Show','uk','on','','','','','','','','','','on','','','on','','','','','','','','','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (15,'The Dark Knight','https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg','Batman faces the Joker in a battle for Gotham.','Amazon Prime Video',9.0,12,'Action, Crime, Drama','152m',2008,'https://www.youtube.com/watch?v=EXeTwQWrcwY','Movie','us','','','on','','','','','','on','','on','','','on','','','','','','','','','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (17,'Interstellar','https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg','Explorers travel through a wormhole in space.','Amazon Prime Video',8.6,12,'Science Fiction, Drama','169m',2014,'https://www.youtube.com/watch?v=zSWdZVtXT7E','Movie','us','','','on','','','','','','','','on','','','','','on','','','','','','','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (18,'The Matrix','https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg','A hacker learns the truth about reality.','Netflix',8.7,15,'Science Fiction, Action','136m',1999,'https://www.youtube.com/watch?v=vKQi3bBA1y8','Movie','us','on','','','','','','','','on','','','','','','','on','','','','','','','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (20,'The Social Network','https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg','The founding of Facebook and its legal fallout.','Netflix',7.8,12,'Drama, Biography','120m',2010,'https://www.youtube.com/watch?v=lB95KLmpLR4','Movie','us','on','','','','','','','','','','on','','','','','','','','','on','','','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (21,'The Office (us)','https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg','A mockumentary about office workers.','Netflix',9.0,12,'Comedy','22m',2005,'https://www.youtube.com/watch?v=tNcDHWpselE','TV Show','us','on','','','','','','','','','on','','','','','','','','','','','','','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (22,'Stranger Things','https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg','Kids uncover supernatural mysteries in their town.','Netflix',8.7,15,'Science Fiction, Horror','50m',2016,'https://www.youtube.com/watch?v=b9EkMc79ZSU','TV Show','us','on','','','','','','','','','','','','','','','on','','','','','','','','','','','','on','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (23,'The Mandalorian','https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg','A lone bounty hunter travels the outer reaches of the galaxy.','Disney+',8.8,12,'Adventure, Science Fiction','40m',2019,'https://www.youtube.com/watch?v=aOC8E8z_ifw','TV Show','us','','on','','','','','','','','','','on','','','','on','','','','','','','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (24,'Toy Story','https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg','Toys come to life when humans are not around.','Disney+',8.3,0,'Animation, Family','81m',1995,'https://www.youtube.com/watch?v=KYz2wyBy3kc','Movie','us','','on','','','','','','','','','','','','','','','','on','','','','on','','','','','','','2026-01-02 14:38:39','2026-01-02 14:38:39');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (25,'Dune','https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg','Paul Atreides leads a rebellion on the desert planet Arrakis.','Amazon Prime Video',8.2,12,'Action, Adventure, Science Fiction','155m',2021,'https://www.youtube.com/watch?v=n9xhJrPXop4','Movie','uk','','','on','','','','','','on','','','on','','','','on','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (26,'Dune','https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg','Paul Atreides leads a rebellion on the desert planet Arrakis.','Max',8.2,12,'Action, Adventure, Science Fiction','155m',2021,'https://www.youtube.com/watch?v=n9xhJrPXop4','Movie','us','','','','','','','','on','on','','','on','','','','on','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (27,'Avatar: The Way of Water','https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg','Jake Sully and Neytiri lead the Na\'vi against humans.','Disney+',7.8,12,'Action, Adventure, Fantasy','192m',2022,'https://www.youtube.com/watch?v=d9MyW72ELq0','Movie','uk','','on','','','','','','','on','','','on','','','','','on','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 16:02:44');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (28,'Avatar: The Way of Water','https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg','Jake Sully and Neytiri lead the Na\'vi against humans.','Disney+',7.8,12,'Action, Adventure, Fantasy','192m',2022,'https://www.youtube.com/watch?v=d9MyW72ELq0','Movie','us','','on','','','','','','','on','','','on','','','','','on','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 16:02:44');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (29,'The Queen\'s Gambit','https://image.tmdb.org/t/p/w500/lnIN6b2DId2uLXN4iW7lBLU6Aoh.jpg','A chess prodigy rises to the top while struggling with addiction.','Netflix',8.6,15,'Drama','50m',2020,'https://www.youtube.com/watch?v=CDrieqwSdgI','TV Show','us','on','','','','','','','','','','on','','','','','','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (30,'The Queen\'s Gambit','https://image.tmdb.org/t/p/w500/lnIN6b2DId2uLXN4iW7lBLU6Aoh.jpg','A chess prodigy rises to the top while struggling with addiction.','Netflix',8.6,15,'Drama','50m',2020,'https://www.youtube.com/watch?v=CDrieqwSdgI','TV Show','uk','on','','','','','','','','','','on','','','','','','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (32,'The Mandalorian','https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg','A lone bounty hunter travels the galaxy with a mysterious child.','Disney+',8.8,12,'Adventure, Science Fiction','40m',2019,'https://www.youtube.com/watch?v=aOC8E8z_ifw','TV Show','uk','','on','','','','','','','','','','on','','','','on','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (33,'Squid Game','https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg','Contestants risk their lives in deadly children\'s games for money.','Netflix',8.0,18,'Thriller, Drama','55m',2021,'https://www.youtube.com/watch?v=oqxAJKy0ii4','TV Show','uk','on','','','','','','','','','','on','','on','','','','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (34,'Squid Game','https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg','Contestants risk their lives in deadly children\'s games for money.','Netflix',8.0,18,'Thriller, Drama','55m',2021,'https://www.youtube.com/watch?v=oqxAJKy0ii4','TV Show','us','on','','','','','','','','','','on','','on','','','','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (35,'Loki','https://media.themoviedb.org/t/p/w440_and_h660_face/oJdVHUYrjdS2IqiNztVIP4GPB1p.jpg','The God of Mischief steps out of his brother\'s shadow.','Disney+',8.2,12,'Action, Adventure, Science Fiction','45m',2021,'https://www.youtube.com/watch?v=IV3DcRj2YD8','TV Show','us','','on','','','','','','','on','','','on','','','','on','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (36,'Loki','https://media.themoviedb.org/t/p/w440_and_h660_face/oJdVHUYrjdS2IqiNztVIP4GPB1p.jpg','The God of Mischief steps out of his brother\'s shadow.','Disney+',8.2,12,'Action, Adventure, Science Fiction','45m',2021,'https://www.youtube.com/watch?v=IV3DcRj2YD8','TV Show','uk','','on','','','','','','','on','','','on','','','','on','','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (37,'The Witcher','https://image.tmdb.org/t/p/w500/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg','A mutated monster hunter struggles to find his place in the world.','Netflix',8.2,15,'Action, Fantasy, Adventure','60m',2019,'https://www.youtube.com/watch?v=ndl1W4ltcmg','TV Show','uk','on','','','','','','','','on','','','on','','','','','on','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (38,'The Witcher','https://image.tmdb.org/t/p/w500/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg','A mutated monster hunter struggles to find his place in the world.','Netflix',8.2,15,'Action, Fantasy, Adventure','60m',2019,'https://www.youtube.com/watch?v=ndl1W4ltcmg','TV Show','us','on','','','','','','','','on','','','on','','','','','on','','','','','','','','','','','','2026-01-02 14:41:17','2026-01-02 14:41:17');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (39,'Spider-Man: No Way Home','https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg','Peter Parker teams up with other Spider-Men to face villains from other dimensions.','Max',8.7,12,'Action, Adventure, Superhero','148m',2021,'https://www.youtube.com/watch?v=JfVOs4VSpmA','Movie','us','','','','','','','','on','on','','','on','','','','','','','','','','','','','on','','','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (40,'Spider-Man: No Way Home','https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg','Peter Parker teams up with other Spider-Men to face villains from other dimensions.','Max',8.7,12,'Action, Adventure, Superhero','148m',2021,'https://www.youtube.com/watch?v=JfVOs4VSpmA','Movie','uk','','','','','','','','on','on','','','on','','','','','','','','','','','','','on','','','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (42,'1917','https://image.tmdb.org/t/p/w500/aKx1ARwG55zZ0GpRvU2WrGrCG9o.jpg','Two British soldiers must deliver a message across enemy lines to save hundreds of lives.','Max',8.3,15,'War, Drama, Thriller','119m',2019,'https://www.youtube.com/watch?v=YqNYrYUiMfg','Movie','us','','','','','','','','on','','','on','','on','','','','','','','','','','','','','','on','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (43,'The Witch','https://image.tmdb.org/t/p/w500/rq5H5LLhM7XWmTbqV8A2s0k0DdI.jpg','A family in 1600s New England falls prey to dark forces in the woods.','Netflix',6.9,15,'Horror, Drama','92m',2015,'https://www.youtube.com/watch?v=5f5mSlyV_lA','Movie','uk','on','','','','','','','','','','on','','','','','','','','','','','','','','','','','on','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (44,'The Witch','https://image.tmdb.org/t/p/w500/rq5H5LLhM7XWmTbqV8A2s0k0DdI.jpg','A family in 1600s New England falls prey to dark forces in the woods.','Netflix',6.9,15,'Horror, Drama','92m',2015,'https://www.youtube.com/watch?v=5f5mSlyV_lA','Movie','us','on','','','','','','','','','','on','','','','','','','','','','','','','','','','','on','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (45,'Coco','https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg','A young boy travels to the Land of the Dead to discover his family history.','Disney+',8.4,7,'Family, Animation, Music','105m',2017,'https://www.youtube.com/watch?v=Rvr68u6k5sI','Movie','uk','','on','','','','','','','','','','','','','','','','on','','','','on','on','','','','','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (46,'Coco','https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg','A young boy travels to the Land of the Dead to discover his family history.','Disney+',8.4,7,'Family, Animation, Music','105m',2017,'https://www.youtube.com/watch?v=Rvr68u6k5sI','Movie','us','','on','','','','','','','','','','','','','','','','on','','','','on','on','','','','','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (47,'Black Panther','https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg','T\'Challa returns home as king of Wakanda, but a new challenger threatens his throne.','Disney+',7.3,12,'Action, Adventure, Superhero','134m',2018,'https://www.youtube.com/watch?v=xjDjIWPwcPU','Movie','uk','','on','','','','','','','on','','','on','','','','','','','','','','','','','on','','','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (48,'Black Panther','https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg','T\'Challa returns home as king of Wakanda, but a new challenger threatens his throne.','Disney+',7.3,12,'Action, Adventure, Superhero','134m',2018,'https://www.youtube.com/watch?v=xjDjIWPwcPU','Movie','us','','on','','','','','','','on','','','on','','','','','','','','','','','','','on','','','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (49,'Avengers: Endgame','https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg','The Avengers assemble once more to undo Thanos\' actions and save the universe.','Disney+',8.4,12,'Action, Adventure, Superhero','181m',2019,'https://www.youtube.com/watch?v=TcMBFSGVi1c','Movie','uk','','on','','','','','','','on','','','on','','','','','','','','','','','','','on','','','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (50,'Avengers: Endgame','https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg','The Avengers assemble once more to undo Thanos\' actions and save the universe.','Disney+',8.4,12,'Action, Adventure, Superhero','181m',2019,'https://www.youtube.com/watch?v=TcMBFSGVi1c','Movie','us','','on','','','','','','','on','','','on','','','','','','','','','','','','','on','','','','2026-01-02 14:45:19','2026-01-02 14:45:19');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (51,'It','https://media.themoviedb.org/t/p/w440_and_h660_face/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg','Children in Derry are terrorized by a shape-shifting clown named Pennywise.','Netflix',7.3,15,'Horror, Thriller','135m',2017,'https://www.youtube.com/watch?v=xKJmEC5ieOk','Movie','uk','on','','','','','','','','','','','','on','','','','','','','','','','','','','','','on','2026-01-02 14:45:19','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (52,'It','https://media.themoviedb.org/t/p/w440_and_h660_face/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg','Children in Derry are terrorized by a shape-shifting clown named Pennywise.','Hulu',7.3,15,'Horror, Thriller','135m',2017,'https://www.youtube.com/watch?v=xKJmEC5ieOk','Movie','us','','','','','','','on','','','','','','on','','','','','','','','','','','','','','','on','2026-01-02 14:45:19','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (53,'Encanto','https://media.themoviedb.org/t/p/w440_and_h660_face/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg','A young girl discovers her family\'s magical gifts in Colombia.','Disney+',7.3,7,'Family, Animation, Music','102m',2021,'https://www.youtube.com/watch?v=CaimKeDcudo','Movie','uk','','on','','','','','','','','','','','','','','','','on','','','','on','on','','','','','','2026-01-02 14:45:19','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (54,'Encanto','https://media.themoviedb.org/t/p/w440_and_h660_face/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg','A young girl discovers her family\'s magical gifts in Colombia.','Disney+',7.3,7,'Family, Animation, Music','102m',2021,'https://www.youtube.com/watch?v=CaimKeDcudo','Movie','us','','on','','','','','','','','','','','','','','','','on','','','','on','on','','','','','','2026-01-02 14:45:19','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (55,'Titanic','https://image.tmdb.org/t/p/w500/kHXEpyfl6zqn8a6YuozZUujufXf.jpg','A young couple falls in love aboard the ill-fated Titanic.','Netflix',7.8,12,'Drama, Romance','195m',1997,'https://www.youtube.com/watch?v=kVrqfYjkTdQ','Movie','uk','on','','','','','','','','','','on','','','','on','','','','','','','','','','','','','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (56,'Titanic','https://image.tmdb.org/t/p/w500/kHXEpyfl6zqn8a6YuozZUujufXf.jpg','A young couple falls in love aboard the ill-fated Titanic.','Peacock',7.8,12,'Drama, Romance','195m',1997,'https://www.youtube.com/watch?v=kVrqfYjkTdQ','Movie','us','','','','','','on','','','','','on','','','','on','','','','','','','','','','','','','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (57,'La La Land','https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg','An aspiring actress and a jazz musician fall in love in Los Angeles.','Netflix',8.0,12,'Comedy, Drama, Romance','128m',2016,'https://www.youtube.com/watch?v=0pdqf4P9MB8','Movie','uk','on','','','','','','','','','on','on','','','','on','','','','','','','','','','','','','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (58,'La La Land','https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg','An aspiring actress and a jazz musician fall in love in Los Angeles.','Hulu',8.0,12,'Comedy, Drama, Romance','128m',2016,'https://www.youtube.com/watch?v=0pdqf4P9MB8','Movie','us','','','','','','','on','','','on','on','','','','on','','','','','','','','','','','','','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (59,'Casablanca','https://image.tmdb.org/t/p/w500/6xKCYgH16UuwEGAyroLU6p8HLIn.jpg','A nightclub owner must choose between love and helping his former lover.','Now TV',8.5,12,'Drama, Romance, War','102m',1942,'https://www.youtube.com/watch?v=BkL9l7qovsE','Movie','uk','','','','on','','','','','','','on','','','','on','','','','','','','','','','','','on','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (60,'Casablanca','https://image.tmdb.org/t/p/w500/6xKCYgH16UuwEGAyroLU6p8HLIn.jpg','A nightclub owner must choose between love and helping his former lover.','Amazon Prime Video',8.5,12,'Drama, Romance, War','102m',1942,'https://www.youtube.com/watch?v=BkL9l7qovsE','Movie','us','','','on','','','','','','','','on','','','','on','','','','','','','','','','','','on','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (61,'Dunkirk','https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg','Allied soldiers are evacuated from Dunkirk during WWII under enemy fire.','Now TV',7.9,12,'Action, War, Thriller','106m',2017,'https://www.youtube.com/watch?v=F-eMt3SrfFU','Movie','uk','','','','on','','','','','on','','','','on','','','','','','','','','','','','','','on','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (62,'Dunkirk','https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg','Allied soldiers are evacuated from Dunkirk during WWII under enemy fire.','Max',7.9,12,'Action, War, Thriller','106m',2017,'https://www.youtube.com/watch?v=F-eMt3SrfFU','Movie','us','','','','','','','','on','on','','','','on','','','','','','','','','','','','','','on','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (63,'Hereditary','https://media.themoviedb.org/t/p/w440_and_h660_face/hjlZSXM86wJrfCv5VKfR5DI2VeU.jpg','A family experiences terrifying secrets after the death of their matriarch.','Netflix',7.3,18,'Horror, Drama, Mystery','127m',2018,'https://www.youtube.com/watch?v=V6wWKNij_1M','Movie','uk','on','','','','','','','','','','on','','','','','','','','on','','','','','','','','','on','2026-01-02 14:47:05','2026-01-02 15:15:34');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (64,'Hereditary','https://media.themoviedb.org/t/p/w440_and_h660_face/hjlZSXM86wJrfCv5VKfR5DI2VeU.jpg','A family experiences terrifying secrets after the death of their matriarch.','Hulu',7.3,18,'Horror, Drama, Mystery','127m',2018,'https://www.youtube.com/watch?v=V6wWKNij_1M','Movie','us','','','','','','','on','','','','on','','','','','','','','on','','','','','','','','','on','2026-01-02 14:47:05','2026-01-02 15:15:34');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (65,'Get Out','https://media.themoviedb.org/t/p/w440_and_h660_face/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg','A young African-American man uncovers disturbing secrets at his girlfriend\'s family estate.','Netflix',7.7,15,'Horror, Thriller, Mystery','104m',2017,'https://www.youtube.com/watch?v=DzfpyUB60YY','Movie','uk','on','','','','','','','','','','','','on','','','','','','on','','','','','','','','','on','2026-01-02 14:47:05','2026-01-02 16:16:24');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (66,'Get Out','https://media.themoviedb.org/t/p/w440_and_h660_face/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg','A young African-American man uncovers disturbing secrets at his girlfriend\'s family estate.','Amazon Prime Video',7.7,15,'Horror, Thriller, Mystery','104m',2017,'https://www.youtube.com/watch?v=DzfpyUB60YY','Movie','us','','','on','','','','','','','','','','on','','','','','','on','','','','','','','','','on','2026-01-02 14:47:05','2026-01-02 16:16:24');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (67,'Moana','https://media.themoviedb.org/t/p/w440_and_h660_face/9tzN8sPbyod2dsa0lwuvrwBDWra.jpg','A spirited girl sets out on a daring mission to save her people.','Disney+',7.6,7,'Animation, Family, Adventure','107m',2016,'https://www.youtube.com/watch?v=LKFuXETZUsI','Movie','uk','','on','','','','','','','','','','on','','','','','','on','','','','on','','','','','','','2026-01-02 14:47:05','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (68,'Moana','https://media.themoviedb.org/t/p/w440_and_h660_face/9tzN8sPbyod2dsa0lwuvrwBDWra.jpg','A spirited girl sets out on a daring mission to save her people.','Disney+',7.6,7,'Animation, Family, Adventure','107m',2016,'https://www.youtube.com/watch?v=LKFuXETZUsI','Movie','us','','on','','','','','','','','','','on','','','','','','on','','','','on','','','','','','','2026-01-02 14:47:05','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (69,'Frozen','https://media.themoviedb.org/t/p/w440_and_h660_face/itAKcobTYGpYT8Phwjd8c9hleTo.jpg','Princess Anna teams up with Kristoff to save her sister Elsa and the kingdom.','Disney+',7.4,7,'Animation, Family, Adventure','102m',2013,'https://www.youtube.com/watch?v=TbQm5doF_Uc','Movie','uk','','on','','','','','','','','','','on','','','','','','on','','','','on','','','','','','','2026-01-02 14:47:05','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (70,'Frozen','https://media.themoviedb.org/t/p/w440_and_h660_face/itAKcobTYGpYT8Phwjd8c9hleTo.jpg','Princess Anna teams up with Kristoff to save her sister Elsa and the kingdom.','Disney+',7.4,7,'Animation, Family, Adventure','102m',2013,'https://www.youtube.com/watch?v=TbQm5doF_Uc','Movie','us','','on','','','','','','','','','','on','','','','','','on','','','','on','','','','','','','2026-01-02 14:47:05','2026-01-02 15:15:10');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (71,'Iron Man','https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg','A billionaire builds a high-tech suit to fight evil.','Disney+',7.9,12,'Action, Adventure, Superhero','126m',2008,'https://www.youtube.com/watch?v=8hYlB38asDY','Movie','uk','','on','','','','','','','on','','','on','','','','','','','','','','','','','on','','','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (72,'Iron Man','https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg','A billionaire builds a high-tech suit to fight evil.','Disney+',7.9,12,'Action, Adventure, Superhero','126m',2008,'https://www.youtube.com/watch?v=8hYlB38asDY','Movie','us','','on','','','','','','','on','','','on','','','','','','','','','','','','','on','','','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (73,'The Boys','https://image.tmdb.org/t/p/w500/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg','A group of vigilantes aim to take down corrupt superheroes.','Prime Video',8.7,18,'Action, Comedy, Superhero','60m',2019,'https://www.youtube.com/watch?v=06z1ZC6FYyA','TV Show','us','','','on','','','','','','on','on','','','','','','','','','','','','','','','on','','','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES (74,'The Boys','https://image.tmdb.org/t/p/w500/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg','A group of vigilantes aim to take down corrupt superheroes.','Prime Video',8.7,18,'Action, Comedy, Superhero','60m',2019,'https://www.youtube.com/watch?v=06z1ZC6FYyA','TV Show','uk','','','on','','','','','','on','on','','','','','','','','','','','','','','','on','','','','2026-01-02 14:47:05','2026-01-02 14:47:05');
INSERT INTO `moviesAndTvShows` (`id`,`name`,`poster`,`synopsis`,`availableOn`,`imdb`,`ageRating`,`genres`,`length`,`yearReleased`,`trailer`,`type`,`country`,`netflix`,`disneyPlus`,`amazonPrime`,`nowTv`,`appleTvPlus`,`peacock`,`hulu`,`max`,`action`,`comedy`,`drama`,`adventure`,`thriller`,`crime`,`romance`,`scienceFiction`,`fantasy`,`family`,`mystery`,`biography`,`history`,`animation`,`music`,`sport`,`superhero`,`western`,`war`,`horror`,`createdAt`,`updatedAt`) VALUES(75,'Aftersun','https://image.tmdb.org/t/p/w500/evKz85EKouVbIr51zy5fOtpNRPg.jpg','A father and daughter spend a bittersweet holiday together, reflecting on memory and growing up.','Netflix',7.7,12,'Drama','101m',2022,'https://www.youtube.com/watch?v=GmQK4sFsm1Y','Movie','uk','on','','','','','','','','','','','on','','','','','','','','','','','','','','','','','2026-01-06 10:00:00','2026-01-06 10:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, amazonPrime, drama, thriller, createdAt, updatedAt)
VALUES
(76,
'Boiling Point',
'https://image.tmdb.org/t/p/w500/6i4n7P5G2J0xZmb7tMZ0pQfM9xF.jpg',
'A chef navigates a chaotic night in a high-pressure restaurant.',
'Prime Video',
7.5,
15,
'Drama, Thriller',
'92m',
2021,
'https://www.youtube.com/watch?v=UBUfCL_tvro',
'Movie',
'uk',
'on',
'on',
'on',
'2026-01-06 10:00:00',
'2026-01-06 10:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, hulu, comedy, romance, scienceFiction, createdAt, updatedAt)
VALUES
(78,
'Palm Springs',
'https://image.tmdb.org/t/p/w500/yf5IuMW6GHghu39kxA0oFx7Bxmj.jpg',
'Two wedding guests find themselves stuck reliving the same day.',
'Hulu',
7.4,
15,
'Comedy, Romance, Science Fiction',
'90m',
2020,
'https://www.youtube.com/watch?v=CpBLtXduh_k',
'Movie',
'us',
'on',
'on',
'on',
'on',
'2026-01-06 10:00:00',
'2026-01-06 10:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, appleTvPlus, drama, music, createdAt, updatedAt)
VALUES
(79,
'CODA',
'https://image.tmdb.org/t/p/w500/BzVjmm8l23rPsijLiNLUzuQtyd.jpg',
'A hearing child of a deaf family discovers her passion for music.',
'Apple TV+',
8.0,
12,
'Drama, Music',
'111m',
2021,
'https://www.youtube.com/watch?v=0pmfrE1YL4I',
'Movie',
'us',
'on',
'on',
'on',
'2026-01-06 10:00:00',
'2026-01-06 10:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, amazonPrime, action, adventure, scienceFiction, createdAt, updatedAt)
VALUES
(81,
'Dune: Part Two',
'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
'Paul Atreides unites with the Fremen to wage war against his enemies.',
'Prime Video',
8.6,
12,
'Action, Adventure, Science Fiction',
'166m',
2024,
'https://www.youtube.com/watch?v=Way9Dexny3w',
'Movie',
'uk',
'on',
'on',
'on',
'on',
'2026-01-06 11:00:00',
'2026-01-06 11:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, disneyPlus, comedy, drama, fantasy, createdAt, updatedAt)
VALUES
(82,
'Poor Things',
'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
'A young woman is brought back to life by an unorthodox scientist.',
'Disney+',
8.1,
18,
'Comedy, Drama, Fantasy',
'141m',
2023,
'https://www.youtube.com/watch?v=RlbR5N6veqw',
'Movie',
'uk',
'on',
'on',
'on',
'on',
'2026-01-06 11:00:00',
'2026-01-06 11:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, amazonPrime, action, comedy, scienceFiction, createdAt, updatedAt)
VALUES
(83,
'Everything Everywhere All at Once',
'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
'An immigrant laundromat owner is swept into an insane multiverse adventure.',
'Prime Video',
7.8,
15,
'Action, Comedy, Science Fiction',
'139m',
2022,
'https://www.youtube.com/watch?v=wxN1T1uxQ2g',
'Movie',
'us',
'on',
'on',
'on',
'on',
'2026-01-06 11:30:00',
'2026-01-06 11:30:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, amazonPrime, comedy, drama, createdAt, updatedAt)
VALUES
(84,
'The Holdovers',
'https://image.tmdb.org/t/p/w500/VHSzNBTwxV8vh7wylo7O9CLdac.jpg',
'A grumpy teacher is forced to stay on campus over Christmas with students.',
'Prime Video',
7.9,
12,
'Comedy, Drama',
'133m',
2023,
'https://www.youtube.com/watch?v=AhKLpJmHhIg',
'Movie',
'us',
'on',
'on',
'on',
'2026-01-06 11:30:00',
'2026-01-06 11:30:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, appleTvPlus, drama, romance, createdAt, updatedAt)
VALUES
(85,
'Past Lives',
'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',
'Two childhood friends reconnect decades later.',
'Apple TV+',
7.9,
12,
'Drama, Romance',
'105m',
2023,
'https://www.youtube.com/watch?v=kA244xewjcI',
'Movie',
'us',
'on',
'on',
'on',
'2026-01-06 12:00:00',
'2026-01-06 12:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, disneyPlus, comedy, drama, createdAt, updatedAt)
VALUES
(86,
'The Banshees of Inisherin',
'https://image.tmdb.org/t/p/w500/4yFG6cSPaCaPhyJ1vtGOtMD1lgh.jpg',
'Two lifelong friends find themselves at an impasse.',
'Disney+',
7.7,
15,
'Comedy, Drama',
'114m',
2022,
'https://www.youtube.com/watch?v=uRu3zLOJN2c',
'Movie',
'uk',
'on',
'on',
'on',
'2026-01-06 12:00:00',
'2026-01-06 12:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, amazonPrime, drama, history, createdAt, updatedAt)
VALUES
(88,
'Oppenheimer',
'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
'The story of J. Robert Oppenheimer and the atomic bomb.',
'Prime Video',
8.4,
15,
'Drama, History',
'180m',
2023,
'https://www.youtube.com/watch?v=uYPbbksJxIg',
'Movie',
'us',
'on',
'on',
'on',
'2026-01-06 13:00:00',
'2026-01-06 13:00:00');
INSERT INTO moviesAndTvShows
(id, name, poster, synopsis, availableOn, imdb, ageRating, genres, length, yearReleased, trailer, type, country, appleTvPlus, crime, drama, history, createdAt, updatedAt)
VALUES
(89,
'Killers of the Flower Moon',
'https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg',
'Members of the Osage tribe are murdered under mysterious circumstances.',
'Apple TV+',
7.6,
15,
'Crime, Drama, History',
'206m',
2023,
'https://www.youtube.com/watch?v=EP34Yoxs3FQ',
'Movie',
'us',
'on',
'on',
'on',
'on',
'2026-01-06 13:00:00',
'2026-01-06 13:00:00');