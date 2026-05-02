<?php
// Autor: Mario Miranda
// Archivo: Categoria.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla categorias en la base de datos.
 *
 * Gestiona las categorías a las que pertenecen los productos
 * del catálogo de la tienda Scripe.
 */
class Categoria extends Model
{
    /**
     * Campos permitidos para asignación masiva (mass assignment).
     *
     * Solo los campos listados aquí pueden ser rellenados
     * mediante métodos como create() o fill().
     *
     * @var array<string>
     */
    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    /**
     * Relación uno a muchos con el modelo Producto.
     *
     * Una categoría puede tener múltiples productos asociados.
     * El nombre del método sigue la convención de Laravel para
     * que el ORM resuelva la relación automáticamente.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productos(){
        return $this->hasMany(Producto::class);
    }
}