<?php
// Autor: Mario Miranda
// Archivo: Direccion.php - Modelo de direcciones de envío

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Direccion extends Model
{
    // Nombre exacto de la tabla en la BD (Laravel pluralizaría mal en inglés)
    protected $table = 'direcciones';

    // Campos que se pueden rellenar masivamente
    protected $fillable = [
        'usuario_id',
        'direccion',
        'ciudad',
        'codigo_postal',
        'es_principal'
    ];

    // Relación con el usuario al que pertenece la dirección
    public function usuario() {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}