<?php
// Autor: Mario Miranda
// Archivo Producto

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla productos.
 * Contiene la información de los bolígrafos disponibles en la tienda.
 */
class Producto extends Model{

    // Definimos los campos que se pueden rellenar (mass assigment)
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'categoria_id'
    ];

    /**
     * Relación N:1
     * Cada producto pertenece a una categoría.
     */
    public function categoria(){
            return $this->belongsTo(Categoria::class);
        }
    
    /**
     * Relación N:M
     * Un producto puede estar en varios pedidos.
     * Esta relación se gestiona mediante la tabla intermedia contenido_pedidos.
     */
    public function pedidos(){
            return $this->belongsToMany(Pedido::class,'contenido_pedidos');
        }
}
