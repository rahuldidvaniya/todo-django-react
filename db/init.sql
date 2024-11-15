-- Initialize Database Schema for Todo Application
-- This script creates all necessary tables and stored procedures

-- ==========================================
-- Drop existing functions if they exist
-- ==========================================
DROP FUNCTION IF EXISTS public.add_project CASCADE;
DROP FUNCTION IF EXISTS public.add_todo CASCADE;
DROP FUNCTION IF EXISTS public.delete_project CASCADE;
DROP FUNCTION IF EXISTS public.delete_todo CASCADE;
DROP FUNCTION IF EXISTS public.edit_project CASCADE;
DROP FUNCTION IF EXISTS public.edit_todo CASCADE;
DROP FUNCTION IF EXISTS public.get_all_todos CASCADE;
DROP FUNCTION IF EXISTS public.list_projects CASCADE;
DROP FUNCTION IF EXISTS public.toggle_todo_completion CASCADE;

-- ==========================================
-- Create Tables
-- ==========================================

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id integer NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT projects_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.projects
    OWNER to postgres;

-- Todos Table
CREATE TABLE IF NOT EXISTS public.todos (
    id integer NOT NULL DEFAULT nextval('todos_id_seq'::regclass),
    project_id integer,
    title character varying(100) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    priority character varying(10) COLLATE pg_catalog."default",
    due_date date,
    is_completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT todos_pkey PRIMARY KEY (id),
    CONSTRAINT todos_project_id_fkey FOREIGN KEY (project_id)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT todos_priority_check CHECK (priority::text = ANY (ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying]::text[]))
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.todos
    OWNER to postgres;

-- ==========================================
-- Project-related Functions
-- ==========================================

-- Add Project Function
CREATE OR REPLACE FUNCTION public.add_project(
    p_name character varying,
    p_description text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    INSERT INTO public.projects(name, description, created_at, updated_at)
    VALUES(p_name, p_description, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END;
$BODY$;

ALTER FUNCTION public.add_project(character varying, text)
    OWNER TO postgres;

-- List Projects Function
CREATE OR REPLACE FUNCTION public.list_projects()
    RETURNS TABLE(
        project_id integer, 
        project_name character varying, 
        project_description text, 
        project_created_at timestamp without time zone, 
        project_updated_at timestamp without time zone
    ) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$
BEGIN
    RETURN QUERY
    SELECT id, name, description, created_at, updated_at
    FROM projects;
END;
$BODY$;

ALTER FUNCTION public.list_projects()
    OWNER TO postgres;

-- Delete Project Function
CREATE OR REPLACE FUNCTION public.delete_project(project_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    DELETE FROM public.projects
    WHERE id = project_id;
END;
$BODY$;

ALTER FUNCTION public.delete_project(integer)
    OWNER TO postgres;

-- Edit Project Function
CREATE OR REPLACE FUNCTION public.edit_project(
    p_id integer,
    p_name character varying,
    p_description text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    UPDATE public.projects
    SET 
        name = p_name,
        description = p_description,
        updated_at = CURRENT_TIMESTAMP
    WHERE 
        id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Project with ID % does not exist', p_id;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.edit_project(integer, character varying, text)
    OWNER TO postgres;

-- ==========================================
-- Todo-related Functions
-- ==========================================

-- Add Todo Function
CREATE OR REPLACE FUNCTION public.add_todo(
    p_project_id integer,
    p_title character varying,
    p_description text,
    p_priority character varying,
    p_due_date date)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    new_todo_id integer;
BEGIN
    INSERT INTO public.todos (project_id, title, description, priority, due_date)
    VALUES (p_project_id, p_title, p_description, p_priority, p_due_date)
    RETURNING id INTO new_todo_id;

    RETURN new_todo_id;
END;
$BODY$;

ALTER FUNCTION public.add_todo(integer, character varying, text, character varying, date)
    OWNER TO postgres;

-- Get All Todos Function
CREATE OR REPLACE FUNCTION public.get_all_todos()
    RETURNS TABLE(
        id integer, 
        project_id integer, 
        title character varying, 
        description text, 
        priority character varying, 
        due_date date, 
        is_completed boolean, 
        created_at timestamp without time zone, 
        updated_at timestamp without time zone
    ) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$
BEGIN
    RETURN QUERY
    SELECT 
        todos.id,
        todos.project_id,
        todos.title,
        todos.description,
        todos.priority,
        todos.due_date,
        todos.is_completed,
        todos.created_at,
        todos.updated_at
    FROM 
        public.todos;
END;
$BODY$;

ALTER FUNCTION public.get_all_todos()
    OWNER TO postgres;

-- Delete Todo Function
CREATE OR REPLACE FUNCTION public.delete_todo(todo_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    DELETE FROM public.todos
    WHERE id = todo_id;

    IF NOT FOUND THEN
        RAISE NOTICE 'Todo with ID % does not exist.', todo_id;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.delete_todo(integer)
    OWNER TO postgres;

-- Edit Todo Function
CREATE OR REPLACE FUNCTION public.edit_todo(
    p_id integer,
    p_title character varying,
    p_description text,
    p_priority character varying,
    p_due_date date)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM todos WHERE id = p_id) THEN
        RAISE EXCEPTION 'Todo with ID % does not exist', p_id;
    END IF;

    IF NOT (p_priority IN ('low', 'medium', 'high')) THEN
        RAISE EXCEPTION 'Invalid priority value. Must be low, medium, or high';
    END IF;

    UPDATE todos 
    SET 
        title = p_title,
        description = p_description,
        priority = p_priority,
        due_date = p_due_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
END;
$BODY$;

ALTER FUNCTION public.edit_todo(integer, character varying, text, character varying, date)
    OWNER TO postgres;

-- Toggle Todo Completion Function
CREATE OR REPLACE FUNCTION public.toggle_todo_completion(todo_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    current_status boolean;
BEGIN
    SELECT is_completed INTO current_status
    FROM public.todos
    WHERE id = todo_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Todo item with id % does not exist', todo_id;
    END IF;

    UPDATE public.todos
    SET is_completed = NOT current_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = todo_id;
END;
$BODY$;

ALTER FUNCTION public.toggle_todo_completion(integer)
    OWNER TO postgres;

-- ==========================================
-- Optional: Add sample data
-- ==========================================
-- Uncomment and modify as needed
/*
INSERT INTO projects (name, description) 
VALUES 
    ('Sample Project', 'This is a sample project'),
    ('Another Project', 'This is another project');

INSERT INTO todos (project_id, title, description, priority, due_date) 
VALUES 
    (1, 'First Task', 'Sample task description', 'high', CURRENT_DATE + 1),
    (1, 'Second Task', 'Another task description', 'medium', CURRENT_DATE + 2),
    (2, 'Project 2 Task', 'Task for second project', 'low', CURRENT_DATE + 3);
*/
