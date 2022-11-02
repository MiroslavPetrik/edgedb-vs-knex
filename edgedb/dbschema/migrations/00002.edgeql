CREATE MIGRATION m1tfcusrjlvqrzpog7qzjoyzs2fi4odlvhaewfhvawrqo23wgkc4ua
    ONTO m1lebioy2zf3j7dzkhbamq43nyvorpgakki2bfqhz2prqhpanjkbkq
{
  ALTER TYPE default::Timestamps {
      ALTER PROPERTY createdAt {
          SET REQUIRED USING (<std::datetime>'2022-11-01T13:15:42.992Z');
      };
  };
  ALTER TYPE default::Timestamps {
      ALTER PROPERTY updatedAt {
          SET REQUIRED USING (<std::datetime>'2022-11-01T13:15:42.992Z');
      };
  };
};
