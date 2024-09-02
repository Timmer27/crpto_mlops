CREATE TABLE IF NOT EXISTS `backtest_metrics` (
  `id` SERIAL PRIMARY KEY NOT NULL,
  `return` float,
  `no_of_trades` int,
  `winning_trades` float,
  `losing_trades` float,
  `max_drawndown` float,
  `shape_ration` float,
  `scene_id` int
);

CREATE TABLE IF NOT EXISTS `scene` (
  `id` SERIAL PRIMARY KEY NOT NULL,
  `from_date` timestamp,
  `to_date` timestamp,
  `indicator_id` int
);

CREATE TABLE IF NOT EXISTS `indicator` (
  `id` SERIAL PRIMARY KEY NOT NULL,
  `indicatorName` VARCHAR(255) NOT NULL,
  `param_from` float,
  `param_to` float
);

CREATE TABLE IF NOT EXISTS `market_data` (
    `datetime` date NOT NULL,
    `open` decimal(18,8) NOT NULL,
    `high` decimal(18,8) NOT NULL,
    `low` decimal(18,8) NOT NULL,
    `close` decimal(18,8) NOT NULL,
    `volume` decimal(18,8) NOT NULL,
    `close_time` bigint NOT NULL,
    `quote_asset_volume` decimal(18,8) NOT NULL,
    `number_of_trades` int NOT NULL,
    `taker_buy_base_asset_volume` decimal(18,8) NOT NULL,
    `taker_buy_quote_asset_volume` decimal(18,8) NOT NULL,
    `ignore` tinyint NOT NULL
);

CREATE TABLE IF NOT EXISTS `users` (
  `id` SERIAL PRIMARY KEY NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL
);

ALTER TABLE `backtest_metrics` ADD FOREIGN KEY (`scene_id`) REFERENCES `scene` (`id`);

ALTER TABLE `indicator` ADD FOREIGN KEY (`id`) REFERENCES `scene` (`id`);

ALTER TABLE `indicator_param` ADD FOREIGN KEY (`id`) REFERENCES `indicator` (`id`);