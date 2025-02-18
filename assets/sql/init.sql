

CREATE TABLE IF NOT EXISTS ca_roles(
    id SERIAL PRIMARY KEY NOT NULL,
    orden INT NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    estatus BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS ca_usuarios(
    id UUID PRIMARY KEY NOT NULL,
    id_rol INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(25) NOT NULL,
    estatus BOOLEAN DEFAULT true NOT NULL,

    CONSTRAINT ca_usuarios_id_rol_fkey FOREIGN KEY (id_rol)
        REFERENCES ca_roles (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS ca_accesos (
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

CREATE TABLE IF NOT EXISTS ca_membresias (
    id INT PRIMARY KEY NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    dias_duracion INT NOT NULL,
    mes_duracion INT NOT NULL,
    descripcion TEXT NOT NULL,
    precio DOUBLE PRECISION NOT NULL,
    estatus BOOLEAN DEFAULT true NOT NULL
    
);

CREATE TABLE IF NOT EXISTS rel_inscripciones (
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

CREATE TABLE IF NOT EXISTS ca_actividades (
    id INT PRIMARY KEY NOT NULL,
    id_instructor UUID NOT NULL,
    descripcion TEXT NOT NULL,
    estatus BOOLEAN NOT NULL,
    cupo INT NOT NULL,
    fecha DATE ,
    hora_inicio TIME ,
    hora_fin TIME,

    CONSTRAINT ca_actividades_id_instructor_fkey FOREIGN KEY (id_instructor)
    REFERENCES ca_usuarios (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS ca_agenda_actividades (
    folio UUID PRIMARY KEY NOT NULL,
    id_usuario UUID NOT NULL,
    id_actividad INT NOT NULL,
    asistencia VARCHAR(255) NOT NULL,
    estatus VARCHAR(255) NOT NULL,
    
    CONSTRAINT ca_actividades_id_actividad_fkey FOREIGN KEY (id_actividad)
    REFERENCES ca_actividades (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,

    CONSTRAINT rel_inscripciones_id_usuario_fkey FOREIGN KEY (id_usuario)
    REFERENCES ca_usuarios (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);






