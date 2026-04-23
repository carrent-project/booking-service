--
-- PostgreSQL database dump
--

\restrict lUzijo1k2ZHtzhfaei7l6y138VuOkVTCfNUxMlfSt2gBF5B7YrLrOPLoXwHb1xN

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."BookingStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id text NOT NULL,
    "userId" text NOT NULL,
    "carId" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "totalPrice" integer NOT NULL,
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b44d45ea-759b-4406-b2f1-3267d24bf53f	d5a69377246795e855dcf48296b76b298b574b75f7d0476bc6384e11db6757ca	2026-04-21 18:32:31.12212+00	20260421183231_init_bookings	\N	\N	2026-04-21 18:32:31.111124+00	1
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, "userId", "carId", "startDate", "endDate", "totalPrice", status, "createdAt", "updatedAt") FROM stdin;
dc72c3d1-ceda-42d5-89e2-9bd33af74fb4	0a99e65d-21b8-425a-9e16-361527c36ad4	b22ce169-6fc1-43eb-97d6-688419fff84c	2026-04-24 10:00:00	2026-05-01 10:00:00	350000	PENDING	2026-04-22 18:25:39.148	2026-04-22 18:25:39.148
837712c0-2b5e-47f7-8ca0-b31b5b01ccb6	0a99e65d-21b8-425a-9e16-361527c36ad4	797a9782-95dd-42b7-8038-a4003b826c8c	2026-06-01 10:00:00	2026-06-10 10:00:00	900000	PENDING	2026-04-23 06:06:38.723	2026-04-23 06:06:38.723
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict lUzijo1k2ZHtzhfaei7l6y138VuOkVTCfNUxMlfSt2gBF5B7YrLrOPLoXwHb1xN

