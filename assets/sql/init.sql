CREATE DATABASE DBGYM;

CREATE TABLE ca_roles(
    id SERIAL PRIMARY KEY NOT NULL,
    orden INT NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    estatus BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE ca_usuarios(
    id UUID PRIMARY KEY NOT NULL,
    id_rol INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(25) NOT NULL,

    CONSTRAINT ca_usuarios_id_rol_fkey FOREIGN KEY (id_rol)
        REFERENCES ca_roles (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE ca_accesos (
    id UUID PRIMARY KEY NOT NULL,  
    id_usuario UUID NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    numero_intentos INTEGER DEFAULT 0 NOT NULL,
    token VARCHAR(255),
    fecha_token TIMESTAMP WITH TIME ZONE,
    fecha_bloqueo TIMESTAMP WITH TIME ZONE,

    CONSTRAINT ca_accesos_id_usuario_fkey FOREIGN KEY (id_usuario)
        REFERENCES ca_usuarios (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE ca_membresias (
    id INT PRIMARY KEY NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    dias_duracion INT NOT NULL,
    mes_duracion INT NOT NULL,
    descripcion TEXT NOT NULL,
    precio DOUBLE PRECISION NOT NULL
    
);

CREATE TABLE rel_inscripciones (
    id VARCHAR PRIMARY KEY NOT NULL,
    id_usuario UUID NOT NULL,
    id_membresia INT NOT NULL,
    estatus BOOLEAN NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_expiracion DATE NOT NULL,

    CONSTRAINT rel_inscripciones_id_usuario_fkey FOREIGN KEY (id_usuario)  
        REFERENCES ca_usuarios (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,

    CONSTRAINT rel_inscripciones_id_membresia_fkey FOREIGN KEY (id_membresia) 
        REFERENCES ca_membresias (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE ca_actividades (
    id INT PRIMARY KEY NOT NULL,
    descripcion TEXT NOT NULL,
    estatus BOOLEAN NOT NULL,
    cupo INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_instructor UUID NOT NULL,

    CONSTRAINT ca_actividades_id_instructor_fkey FOREIGN KEY (id_instructor)
        REFERENCES ca_usuarios (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
    
);

CREATE TABLE ca_agenda_actividades (
    folio VARCHAR(255) PRIMARY KEY NOT NULL,
    id_inscripcion VARCHAR NOT NULL,
    id_actividad INT NOT NULL,
    asistencia BOOLEAN NOT NULL,
    estatus VARCHAR(255) NOT NULL,  

    CONSTRAINT ca_actividades_id_actividad_fkey FOREIGN KEY (id_actividad)
    REFERENCES ca_actividades (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,

    CONSTRAINT rel_inscripciones_id_inscripcion_fkey FOREIGN KEY (id_inscripcion)
    REFERENCES rel_inscripciones (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

-- agregar los roles

INSERT INTO ca_roles(orden, descripcion) VALUES (1, 'Root');
INSERT INTO ca_roles(orden, descripcion) VALUES (2, 'Admin');
INSERT INTO ca_roles(orden, descripcion) VALUES (3, 'Instructor');
INSERT INTO ca_roles(orden, descripcion) VALUES (4, 'Usuario');





