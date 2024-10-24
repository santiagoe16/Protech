"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Products, Categoria
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/products', methods=['GET'])
def get_products():
    products = Products.query.all()
    
    products = list(map(lambda product: product.serialize(), products))
    
    return jsonify(products), 200

@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Products.query.get(product_id)

    if product is None:
        return jsonify({"message": "Product not found"}), 404
    
    return jsonify(product.serialize()), 200

@api.route('/products', methods=['POST'])
def add_product():
    new_product_data = request.get_json()

    if not new_product_data:
        return jsonify({"error": "No data provided for the new product."}), 400
    
    required_fields = ["name", "description", "price", "stock", "image"]
    if not all(field in new_product_data for field in required_fields):
        return jsonify({"error": "Required fields are missing: " + ', '.join(required_fields)}), 400
    
    if not isinstance(new_product_data["price"], (int, float)) or new_product_data["price"] < 0:
        return jsonify({"error": "The price must be a non-negative integer."}), 400
    
    if not isinstance(new_product_data["stock"], int) or new_product_data["stock"] < 0:
        return jsonify({"error": "The stock must be a non-negative integer."}), 400
    
    new_product = Products(
        name=new_product_data["name"],
        description=new_product_data["description"],
        price=new_product_data["price"],
        stock=new_product_data["stock"],
        image=new_product_data["image"]
    )
    
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify({"message":"Product successfully added"}), 201

@api.route('/products/<int:product_id>', methods=['DELETE'])
def remove_product(product_id):

    product = Products.query.get(product_id)

    if not product:
        return jsonify({"message":"Product no found"}), 404

    db.session.delete(product)
    db.session.commit()
    
    return jsonify({"message": "Product successfully removed"}), 200

@api.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):

    product = Products.query.get(product_id)

    if product is None:
        return jsonify({"error": "Producto no encontrado."}), 404

   
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data has been provided for updating."}), 400

    if data["stock"]:
        if not isinstance(data["stock"], int) or data["stock"] < 0:
            return jsonify({"message":"The stock must be a non-negative integer."}), 400
    product.stock = data['stock']

    if data["price"]:
        if not isinstance(data["price"], int) or data["price"] < 0:
            return jsonify({"message":"The price must be a non-negative integer."}), 400
    product.price = data['price']

    # Actualiza directamente los campos del producto
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'image' in data:
        product.image = data['image']

    db.session.commit()
    
    return jsonify({"message":"Product successfully edited"}), 200



@api.route('/categoria', methods=['GET'])
def get_categoria():
    categorias = Categoria.query.all()  # Obtiene todas las categorías de la base de datos
    return jsonify([categoria.serialize() for categoria in categorias]), 200  # Devuelve las categorías en formato JSON

@api.route('/categoria/<int:categoria_id>', methods=['GET'])
def get_categoria_by_id(categoria_id):
    categoria = Categoria.query.get(categoria_id)  # Obtiene la categoría por ID
    if not categoria:
        return jsonify({"message": "Categoría no encontrada"}), 404  # Si no se encuentra, devuelve 404
    return jsonify(categoria.serialize()), 200  # Devuelve la categoría en formato JSON si la encuentra

@api.route('/categoria', methods=['POST'])
def add_categoria():
    new_categoria_data = request.get_json()  # Obtiene los datos JSON enviados en la solicitud

    if not new_categoria_data:  # Verifica que se haya enviado algún dato
        return jsonify({"error": "No se han proporcionado datos"}), 400  # Si no se envía dato, devuelve error 400

    # Verifica que los campos requeridos estén presentes
    required_fields = ["name"]
    if not all(field in new_categoria_data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos: " + ', '.join(required_fields)}), 400  # Si falta algún campo, devuelve error 400

    # Crea una nueva categoría
    new_categoria = Categoria(
        name=new_categoria_data["name"],
    )

    # Guarda la nueva categoría en la base de datos
    db.session.add(new_categoria)
    db.session.commit()

    return jsonify({"message": "Categoría añadida exitosamente"}), 201  # Devuelve mensaje de éxito con código 201

@api.route('/categoria/<int:categoria_id>', methods=['PUT'])
def update_categoria(categoria_id):
    categoria = Categoria.query.get(categoria_id)  # Obtiene la categoría por ID

    if categoria is None:
        return jsonify({"error": "Categoría no encontrada"}), 404  # Si no se encuentra, devuelve error 404

    data = request.get_json()  # Obtiene los datos de la solicitud

    if not data:  # Verifica que los datos no estén vacíos
        return jsonify({"error": "No se han proporcionado datos para actualizar"}), 400  # Si no hay datos, devuelve error 400

    # Actualiza los campos solo si fueron proporcionados en la solicitud
    if 'name' in data:
        categoria.name = data['name']
   
    db.session.commit()  # Guarda los cambios en la base de datos

    return jsonify({"message": "Categoría actualizada exitosamente"}), 200  # Devuelve mensaje de éxito

@api.route('/categoria/<int:categoria_id>', methods=['DELETE'])
def remove_categoria(categoria_id):
    categoria = Categoria.query.get(categoria_id)  # Obtiene la categoría por ID

    if categoria is None:
        return jsonify({"error": "Categoría no encontrada"}), 404  # Devuelve un error 404 si no se encuentra la categoría

    db.session.delete(categoria)  # Elimina la categoría de la base de datos
    db.session.commit()  # Confirma la transacción

    return jsonify({"message": "Categoría eliminada exitosamente"}), 200  # Devuelve un mensaje de éxito


#santiago/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




