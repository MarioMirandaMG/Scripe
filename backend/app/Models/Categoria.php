<?php
// Autor: Mario Miranda
// Archivo Categoria

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla categorias en la base de datos
 */
class Categoria extends Model
{
    // Definimos los campos que se pueden rellenar (mass assigment)
    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    /**
     * Importante no llamarlo relacionar_productos() porque rompemos con la convención
     * del ORM de Laravel (Object-Relational Mapping)
     */
    public function productos(){
            // Devolvemos la clase del modelo
            return $this->hasMany(Producto::class);
        }
}
