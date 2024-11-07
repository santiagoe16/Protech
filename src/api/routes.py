"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Products, Seller , Comprador,Categoria, ItemCart, Cart, Address
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import desc
import cloudinary 
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from cloudinary import api
import os


api = Blueprint('api', __name__)    

# Allow CORS requests to this API
CORS(api)


UPLOAD_FOLDER = 'path/to/upload/folder'  
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#---------products-----------
@api.route('/products', methods=['GET'])
def get_products():
    try:
        products = Products.query.all()
        if not products:
            return jsonify({"message": "No products available"}), 404
        return jsonify(list(map(lambda product: product.serialize(), products))), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching products"}), 500

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

    required_fields = ["name", "description", "price", "stock", "image", "category_id"]
    if not all(field in new_product_data for field in required_fields):
        return jsonify({"error": "Required fields are missing: " + ', '.join(required_fields)}), 400

    # aqui le movi(Martin)
    category = Categoria.query.get(new_product_data["category_id"])
    if not category:
        return jsonify({"error": "Category not found"}), 404

    if not isinstance(new_product_data["price"], (int, float)) or new_product_data["price"] < 0:
        return jsonify({"error": "The price must be a non-negative integer."}), 400
    
    if not isinstance(new_product_data["stock"], int) or new_product_data["stock"] < 0:
        return jsonify({"error": "The stock must be a non-negative integer."}), 400

    new_product = Products(
        name=new_product_data["name"],
        description=new_product_data["description"],
        price=new_product_data["price"],
        stock=new_product_data["stock"],
        image=new_product_data["image"],
        category_id=new_product_data["category_id"],
        seller_id=new_product_data["seller_id"]
    )

    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product successfully added"}), 201

@api.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Products.query.get(product_id)
    if product is None:
        return jsonify({"error": "Product not found."}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data has been provided for updating."}), 400

    if 'category_id' in data:
       #aqui le movi(martin)
        category = Categoria.query.get(data['category_id'])
        if not category:
            return jsonify({"error": "Category not found"}), 404
        product.category_id = data['category_id']

    if 'stock' in data:
        if not isinstance(data["stock"], int) or data["stock"] < 0:
            return jsonify({"message": "The stock must be a non-negative integer."}), 400
        product.stock = data['stock']

    if 'price' in data:
        if not isinstance(data["price"], (int, float)) or data["price"] < 0:
            return jsonify({"message": "The price must be a non-negative integer."}), 400
        product.price = data['price']

    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'image' in data:
        product.image = data['image']

    db.session.commit()
    return jsonify({"message": "Product successfully edited"}), 200

@api.route('/products/<int:product_id>', methods=['DELETE'])
def remove_product(product_id):
    product = Products.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product successfully removed"}), 200

#--------buyer----------------------------------------------

@api.route('/categorias', methods=['GET'])
def get_categorias():
    categorias = Categoria.query.all()  # Obtiene todas las categorías
    return jsonify([categoria.serialize() for categoria in categorias]), 200

@api.route('/categorias/<int:categoria_id>', methods=['GET'])
def get_categoria(categoria_id):
    categoria = Categoria.query.get(categoria_id)  # Obtiene la categoría por ID
    if not categoria:
        return jsonify({"message": "Categoría no encontrada"}), 404
    return jsonify(categoria.serialize()), 200

@api.route('/categorias', methods=['POST'])
def add_categoria():
    new_categoria_data = request.get_json()
    if not new_categoria_data:
        return jsonify({"error": "No se han proporcionado datos"}), 400

    if "name" not in new_categoria_data:
        return jsonify({"error": "No se ha encontrado el campo name"}), 400

    new_categoria = Categoria(name=new_categoria_data["name"])
    db.session.add(new_categoria)
    db.session.commit()
    
    return jsonify({"message": "Categoría añadida exitosamente"}), 201

@api.route('/categorias/<int:categoria_id>', methods=['PUT'])
def update_categoria(categoria_id):
    categoria = Categoria.query.get(categoria_id)
    if categoria is None:
        return jsonify({"error": "Categoría no encontrada"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No se han proporcionado datos para actualizar"}), 400

    if 'name' in data:
        categoria.name = data['name']

    db.session.commit()
    return jsonify({"message": "Categoría actualizada exitosamente"}), 200

@api.route('/categorias/<int:categoria_id>', methods=['DELETE'])
def remove_categoria(categoria_id):
    categoria = Categoria.query.get(categoria_id)
    if categoria is None:
        return jsonify({"error": "Categoría no encontrada"}), 404

    db.session.delete(categoria)
    db.session.commit()
    return jsonify({"message": "Categoría eliminada exitosamente"}), 200

#----------------------------------Endpoints de Comprador-------------------------------------------

@api.route('/compradores', methods=['GET'])
def get_compradores():
    compradores = Comprador.query.all()  # Obtiene todos los compradores de la base de datos
    return jsonify([comprador.serialize() for comprador in compradores]), 200  # Devuelve los compradores en formato JSON

@api.route('/compradores/<int:comprador_id>', methods=['GET'])
def get_comprador(comprador_id):
    comprador = Comprador.query.get(comprador_id)  # Obtiene el comprador por ID
    if not comprador:
        return jsonify({"message": "Comprador no encontrado"}), 404  # Si no se encuentra, devuelve 404
    return jsonify(comprador.serialize()), 200  # Devuelve el comprador en formato JSON si lo encuentra

@api.route('/compradores', methods=['POST'])
def add_comprador():
    new_comprador_data = request.get_json()  # Obtiene los datos JSON enviados en la solicitud

    if not new_comprador_data:  # Verifica que se haya enviado algún dato
        return jsonify({"error": "No data provided"}), 400  # Si no se envía dato, devuelve error 400

    # Verifica que los campos requeridos estén presentes
    required_fields = ["name", "email", "clave", "telefono"]
    if not all(field in new_comprador_data for field in required_fields):
        return jsonify({"error": "Required fields are missing: " + ', '.join(required_fields)}), 400  # Si falta algún campo, devuelve error 400

    # Verifica si ya existe un comprador con el mismo email
    existing_comprador = Comprador.query.filter_by(email=new_comprador_data["email"]).first()
    if existing_comprador:
        return jsonify({"error": "Email is already in use"}), 400  # Si el email ya está en uso, devuelve error 400

    # Crea un nuevo comprador
    new_comprador = Comprador(
        name=new_comprador_data["name"],
        email=new_comprador_data["email"],
        clave=new_comprador_data["clave"],
        telefono=new_comprador_data["telefono"]
    )

    # Guarda el nuevo comprador en la base de datos
    db.session.add(new_comprador)
    db.session.commit()

    return jsonify({"message": "Comprador successfully added"}), 201  # Devuelve mensaje de éxito con código 201

@api.route('/compradores/<int:comprador_id>', methods=['PUT'])
def update_comprador(comprador_id):
    comprador = Comprador.query.get(comprador_id)  # Obtiene el comprador por ID

    if comprador is None:
        return jsonify({"error": "Comprador no encontrado"}), 404  # Si no se encuentra, devuelve error 404

    data = request.get_json()  # Obtiene los datos de la solicitud

    if not data:  # Verifica que los datos no estén vacíos
        return jsonify({"error": "No data has been provided for updating"}), 400  # Si no hay datos, devuelve error 400

    # Actualiza los campos solo si fueron proporcionados en la solicitud
    if 'name' in data:
        comprador.name = data['name']
    if 'email' in data:
        comprador.email = data['email']
    if 'clave' in data:
        comprador.clave = data['clave']
    if 'telefono' in data:
        comprador.telefono = data['telefono']

    db.session.commit()  # Guarda los cambios en la base de datos

    return jsonify({"message": "Comprador successfully updated"}), 200  # Devuelve mensaje de éxito

@api.route('/compradores/<int:comprador_id>', methods=['DELETE'])
def remove_comprador(comprador_id):
    comprador = Comprador.query.get(comprador_id)  # Obtiene el comprador por ID

    if comprador is None:
        return {"error": "Comprador no encontrado"}, 404  # Devuelve un error 404 si no se encuentra el comprador

    db.session.delete(comprador)  # Elimina el comprador de la base de datos
    db.session.commit()  # Confirma la transacción

    return {"message": "Comprador eliminado exitosamente"}, 200  # Devuelve un mensaje de éxito

#-------------------seller----------------------------------------
@api.route('/sellers', methods=['GET'])
def get_sellers():
    sellers = Seller.query.all()
    
    sellers = list(map(lambda seller: seller.serialize(), sellers))
    
    return jsonify(sellers), 200

@api.route('/seller/<int:seller_id>', methods=['GET'])
def get_seller(seller_id):
    seller = Seller.query.get(seller_id)
    if not seller:
        return jsonify({"msg": "Vendedor no encontrado"}), 404
    return jsonify(seller.serialize()), 200


@api.route('/seller/signup', methods=['POST'])
def signup():
    body = request.get_json()

    if not body or not body.get("email") or not body.get("password"):
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    seller = Seller.query.filter_by(email=body["email"]).first()

    if seller is not None:
        return jsonify({"msg": "El usuario ya existe"}), 409

    new_seller = Seller(
        email=body["email"],
        password =body["password"],
        phone=body["phone"],
        bank_account=body["bank_account"],
        is_active=True)
     

    db.session.add(new_seller)
    db.session.commit()

    
    return jsonify({"msg": "Usuario creado exitosamente"}), 200


@api.route('/seller/<int:seller_id>', methods=['DELETE'])
def delete_seller(seller_id):
    seller = Seller.query.get(seller_id)
    
    if not seller :
        return jsonify({"msg": "No autorizado o vendedor no encontrado"}), 403

    db.session.delete(seller)
    db.session.commit()
    return jsonify({"msg": "Vendedor eliminado"}), 200

@api.route('/seller/<int:seller_id>', methods=['PUT'])
def update_seller(seller_id):

    seller = Seller.query.get(seller_id)

    if seller is None:
        return jsonify({"error": "vendedor no existe."}), 404

   
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data has been provided for updating."}), 400

   
    if 'email' in data:
        seller.email = data['email']
    if 'password' in data:
        seller.password = data['password']
    if 'phone' in data:
        seller.phone = data['phone']
    if 'bank_account' in data:
        seller.bank_account = data['bank_account']

    db.session.commit()
    
    return jsonify({"msg":"vendedor actualizado"}), 200

#-------------itemcart-------------------------


@api.route('/itemscarts', methods=['GET'])
def get_itemscarts():
    carts = ItemCart.query.all()
    
    carts = list(map(lambda cart: cart.serialize(), carts))
    
    return jsonify(carts), 200

@api.route('/itemscarts/<int:itemcart_id>', methods=['GET'])
def get_itemcart(itemcart_id):
    item_cart = ItemCart.query.get(itemcart_id)
    if item_cart is None:
        return jsonify({"message": "Product not found"}), 404
    
    return jsonify(item_cart.serialize()), 200

@api.route('/itemscarts', methods=['POST'])
@jwt_required()
def add_itemcart():
    new_item_cart = request.get_json()

    comprador_id = get_jwt_identity()

    cart = Cart.query.filter_by(comprador_id=comprador_id, state='open').first()

    if not cart:
        cart = Cart(comprador_id=comprador_id, total_price=0, state='open')
        db.session.add(cart)
        db.session.commit()

    if not new_item_cart:
        return jsonify({"error": "No data provided for the new item cart."}), 400

    if "amount" not in new_item_cart:
        return jsonify({"error": "You have to enter an amount"}), 400

    if not isinstance(new_item_cart["amount"], int) or new_item_cart["amount"] < 1:
        return jsonify({"error": "The amount must be a positive integer."}), 400

    product = Products.query.get(new_item_cart["product_id"])
    if not product:
        return jsonify({"error": "The product with the given ID does not exist."}), 404
    
    item_exist = ItemCart.query.filter_by(cart_id = cart.id, product_id = product.id).first()

    if item_exist:
        item_exist.amount += new_item_cart["amount"]
        cart.total_price += product.price * new_item_cart["amount"]

    else:
        new_item = ItemCart(
            amount=new_item_cart["amount"],
            product_id=new_item_cart["product_id"],
            cart_id=cart.id
        )

        cart.total_price += product.price * new_item_cart["amount"]

        db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Product successfully added to cart", "cart_total": cart.total_price}), 201

@api.route('/itemscarts/<int:itemcart_id>', methods=['DELETE'])
def remove_itemcart(itemcart_id):

    itemcart = ItemCart.query.get(itemcart_id)

    if not itemcart:
        return jsonify({"message":"itemcart no found"}), 404

    db.session.delete(itemcart)
    db.session.commit()
    
    return jsonify({"message": "itemcart successfully removed"}), 200

@api.route('/itemscarts/<int:itemcart_id>', methods=['PUT'])
def update_itemcart(itemcart_id):

    itemcart = ItemCart.query.get(itemcart_id)

    if itemcart is None:
        return jsonify({"error": "itemcart no found."}), 404

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data has been provided for updating."}), 400

    if not isinstance(data["amount"], int) or data["amount"] < 1:
        return jsonify({"message":"The amount must be a non-negative integer."}), 400

    itemcart.amount = data["amount"]
    itemcart.product_id = data["product_id"]
    itemcart.cart_id = data["cart_id"]

    db.session.commit()
    
    return jsonify({"message":"itemcart successfully edited"}), 200

#------------------cart----------------------------------------
@api.route('/cart/<int:cart_id>/generate', methods=['PUT'])
def generate_cart(cart_id):

    cart = Cart.query.get(cart_id)

    if cart is None:
        return jsonify({"error": "Cart not found"}), 404

    if cart.state != 'open':
        return jsonify({"error": "The cart is not in an open state"}), 400

    itemscart = ItemCart.query.filter_by(cart_id=cart.id).all()

    if not itemscart or len(itemscart) == 0:
        return jsonify({"error": "The cart is empty"}), 400

    cart.state = 'generated'
    db.session.commit()

    return jsonify({"message": "Cart successfully generated"}), 200

@api.route('/carts/itemscart', methods=['GET'])
@jwt_required()
def get_carts_items():
    buyer_id = get_jwt_identity()

    carts = Cart.query.filter(Cart.comprador_id == buyer_id, Cart.state.in_(['generated', 'sent', 'finalized'])).all()
    
    if not carts:
        return jsonify({"message": "No carts found for the buyer."}), 404

    carts_data = []

    for cart in carts:
        cart_items = cart.items_cart.all()

        items = []

        for item in cart_items:
            item_data = {
                "item_id": item.id,
                "amount": item.amount,
                "product": item.product.serialize()
            }
            items.append(item_data)
        
        cart_data = {
            "cart_id": cart.id,
            "state": cart.state,
            "created_at": cart.created_at,
            "total_price": cart.total_price,
            "items": items
        }
        carts_data.append(cart_data)

    return jsonify(carts_data), 200

@api.route('/buyer/cart/products/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item_quantity(item_id):
    body = request.get_json()

    # Verificar que se haya pasado la cantidad en el cuerpo de la solicitud
    if "amount" not in body:
        return jsonify({"msg": "Amount is required"}), 400

    new_amount = body["amount"]

    # Verificar que la cantidad sea válida (mayor a 0)
    if new_amount <= 0:
        new_amount = 1

    # Buscar el item en el carrito por su ID
    item_cart = ItemCart.query.get(item_id)
    
    if not item_cart:
        return jsonify({"msg": "Item not found"}), 404

    # Actualizar la cantidad del producto en el carrito
    item_cart.amount = new_amount
    db.session.commit()

    return jsonify({"msg": "Quantity updated successfully", "item": item_cart.serialize()}), 200

@api.route('/carts', methods=['GET'])
def get_carts():
    carts = Cart.query.all()
    carts = list(map(lambda cart: cart.serialize(), carts))
    return jsonify(carts), 200

@api.route('/carts/<int:cart_id>', methods=['GET'])
def get_cart(cart_id):
    cart = Cart.query.get(cart_id)
    if cart is None:
        return jsonify({"message": "Cart not found"}), 404
    return jsonify(cart.serialize()), 200

@api.route("/carts", methods=["POST"])
def create_cart():
    data = request.get_json()
    comprador_id = data.get('comprador_id')
    state = data.get('state')
    
    if Comprador.query.get(comprador_id) is None:
        return jsonify({"message": "Comprador not found"}), 404

    valid_states = {"open", "generated", "sent", "completed"}
    if state not in valid_states:
        return jsonify({"error": f"Invalid state. Allowed values are: {', '.join(valid_states)}"}), 400

    total_price = data.get('total_price', 0)
    if not comprador_id or not state:
        return jsonify({"error": "Missing comprador_id or state"}), 400

    new_cart = Cart(
        comprador_id=comprador_id,
        state=state,
        total_price=total_price
    )

    db.session.add(new_cart)
    db.session.commit()

    return jsonify(new_cart.serialize()), 201

@api.route('/carts/<int:cart_id>', methods=['DELETE'])
def remove_cart(cart_id):
    cart = Cart.query.get(cart_id)
    if not cart:
        return jsonify({"message": "Cart not found"}), 404

    db.session.delete(cart)
    db.session.commit()
    return jsonify({"message": "Cart successfully removed"}), 200

@api.route("/carts/<int:cart_id>", methods=["PUT"])
def update_cart(cart_id):
    cart = Cart.query.get(cart_id)
    if cart is None:
        return jsonify({"error": "Cart not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    valid_states = {"open", "generated", "sent", "completed"}
    if 'state' in data:
        new_state = data['state']
        if new_state not in valid_states:
            return jsonify({"error": f"Invalid state. Allowed values are: {', '.join(valid_states)}"}), 400
        cart.state = new_state

    if 'total_price' in data:
        new_total_price = data['total_price']
        if not isinstance(new_total_price, int) or new_total_price < 0:
            return jsonify({"error": "Total price must be a positive integer"}), 400
        cart.total_price = new_total_price

    db.session.commit()
    return jsonify(cart.serialize()), 200

@api.route("/buyer/cart/products", methods=["GET"])
@jwt_required()
def GetBuyerCartProducts():
    buyer_id = get_jwt_identity()

    cart = Cart.query.filter_by(comprador_id=buyer_id, state='open').first()

    if not cart:
        cart = Cart(comprador_id=buyer_id, total_price=0, state='open')
        db.session.add(cart)
        db.session.commit()

    cart_items = cart.items_cart.all()

    items = []
    for item in cart_items:
        item_data = {
            "cart_id": cart.id,
            "item_id": item.id,
            "amount": item.amount,
            "product": item.product.serialize()
        }
        items.append(item_data)

    return jsonify(items), 200

@api.route("/buyer/cart/products/<int:item_id>", methods=["DELETE"])
@jwt_required()
def RemoveBuyerCartProducts(item_id):
    buyer_id = get_jwt_identity()

    cart = Cart.query.filter_by(comprador_id=buyer_id, state = "open").first()

    if not cart:
        return jsonify({"error": "No cart found for this buyer."}), 404

    cart_item = ItemCart.query.filter_by(cart_id=cart.id, id=item_id).first()

    if not cart_item:
        return jsonify({"error": "No item found in the cart."}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({"message": "Product removed from cart"}), 200

#------------------LOGINBUYERS---------------

@api.route("/buyer/signup", methods = ['POST'])
def signupBuyer():
    new_comprador_data = request.get_json() 

    if not new_comprador_data: 
        return jsonify({"error": "No data provided"}), 400  
  
    required_fields = ["name", "email", "clave", "telefono"]
    if not all(field in new_comprador_data for field in required_fields):
        return jsonify({"error": "Required fields are missing: " + ', '.join(required_fields)}), 400  

    existing_comprador = Comprador.query.filter_by(email=new_comprador_data["email"]).first()
    if existing_comprador:
        return jsonify({"error": "Email is already in use"}), 400

    new_comprador = Comprador(
        name=new_comprador_data["name"],
        email=new_comprador_data["email"],
        clave=new_comprador_data["clave"],
        telefono=new_comprador_data["telefono"]
    )

    db.session.add(new_comprador)
    db.session.commit()

    return jsonify({"message": "Comprador successfully added"}), 201


@api.route("/buyer/login", methods=["POST"])
def loginbuyer():
    email = request.json.get("email")
    clave = request.json.get("clave")
    comprador = Comprador.query.filter_by(email = email, clave = clave).first()

    if comprador is None or clave != comprador.clave:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity= comprador.id)

    return jsonify(access_token=access_token), 200

#--------------direccion-----------------------------

@api.route('/address', methods=['POST'])
def create_address():
    data = request.get_json()

    required_fields = ['address', 'city', 'postal_code', 'country']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    new_address = Address(
        address=data['address'],
        city=data['city'],
        postal_code=data['postal_code'],
        country=data['country']
    )
    
    db.session.add(new_address)
    db.session.commit()

    return jsonify(new_address.serialize()), 201

@api.route('/addresses', methods=['GET'])
def get_addresses():
    addresses = Address.query.all()
    return jsonify([address.serialize() for address in addresses]), 200

@api.route('/address/<int:id>', methods=['GET'])
def get_address(id):
    address = Address.query.get_or_404(id)
    return jsonify(address.serialize()), 200

@api.route('/address/<int:id>', methods=['PUT'])
def update_address(id):
    data = request.get_json()
    address = Address.query.get_or_404(id)

    address.address = data.get('address', address.address)
    address.city = data.get('city', address.city)
    address.postal_code = data.get('postal_code', address.postal_code)
    address.country = data.get('country', address.country)
    
    db.session.commit()

    return jsonify(address.serialize()), 200

@api.route('/address/<int:id>', methods=['DELETE'])
def delete_address(id):
    address = Address.query.get_or_404(id)
    db.session.delete(address)
    db.session.commit()

    return jsonify({"message": "Address deleted successfully"}), 200


#------------LOGIN SELLERS  ----------------------------------

@api.route('/seller/login', methods=['POST'])
def login():

    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    seller = Seller.query.filter_by(email=email, password=password).first()

    if seller is None or password != seller.password:
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401


    access_token = create_access_token(identity=seller.id)
    
    return jsonify(access_token=access_token, seller_id=seller.id), 200

@api.route('/seller/reg', methods=['POST'])
def signupSeller():
    new_seller_data = request.get_json()

    if not new_seller_data or not new_seller_data.get("email") or not new_seller_data.get("password") or not new_seller_data.get("phone") or not new_seller_data.get("bank_account"):
        return jsonify({"msg": "Email, contraseña, teléfono y cuenta bancaria son requeridos"}), 400
    
    seller = Seller.query.filter_by(email=new_seller_data["email"]).first()

    if seller is not None:
        return jsonify({"msg": "El usuario ya existe"}), 409

    new_seller = Seller(
        email=new_seller_data["email"],
        name=new_seller_data["name"],
        phone=new_seller_data["phone"],
        bank_account=new_seller_data["bank_account"],
        password=new_seller_data["password"],
        is_active=True)
    

    db.session.add(new_seller)
    db.session.commit()

    access_token = create_access_token(identity=new_seller.id)
    
    return jsonify({"msg": "Usuario creado exitosamente", "access_token": access_token}), 200

#---------------------google api--------------------------
@api.route('/address/seller', methods=['PUT'])
@jwt_required()
def add_address_seller():
    seller_id = get_jwt_identity()
    seller = Seller.query.get_or_404(seller_id)

    data = request.get_json()

    # Agregar validación de datos
    address = data.get("address")
    lat = data.get("lat")
    
    lon = data.get("lon")

    if not isinstance(address, str) or not isinstance(lat, str) or not isinstance(lon, str):
        return jsonify({"error": "Invalid data types"}), 400

    seller.address = address
    seller.lat = lat
    seller.lon = lon

    db.session.commit()

    return jsonify({"message": "address updated"}), 200

@api.route('/address/seller', methods=['GET'])
@jwt_required()
def get_address_seller():
    # Obtener el ID del vendedor desde el JWT
    seller_id = get_jwt_identity()
    
    # Intentar obtener el vendedor desde la base de datos
    seller = Seller.query.get_or_404(seller_id)

    # Preparar la respuesta con la dirección del vendedor
    seller_address = {
        "address": seller.address or "No address assigned",  # Opcional: manejar si no hay dirección
        "lat": seller.lat or "No latitude available",
        "lon": seller.lon or "No longitude available"
    }

    return jsonify(seller_address), 200


#--------Orders------------------------------------------------------
@api.route('/carts/seller', methods=['GET']) 
@jwt_required()
def get_orders_by_seller():
    try:
        seller_id = get_jwt_identity()  
        carts = Cart.query.all()  

        filtered_carts = []
        for cart in carts:
            
            filtered_items = [
                item for item in cart.items_cart if item.product.seller_id == seller_id
            ]

            if filtered_items:
                cart_data = cart.serialize()
              
                cart_data["items_cart"] = [item.serialize() for item in filtered_items]
                filtered_carts.append(cart_data)

        return jsonify(filtered_carts), 200  

    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    
@api.route('/api/carts/<int:cart_id>', methods=["PUT"])
@jwt_required()  
def change_status(cart_id):
    new_status = request.json.get("state")
    valid_transitions = {
        "generated": "sent",
        "sent": "completed"
    }

    if new_status not in valid_transitions.values():
        return jsonify({"error": "Invalid status"}), 400

    cart = Cart.query.get(cart_id)
    if cart is None:
        return jsonify({"error": "Cart not found"}), 404

    if valid_transitions.get(cart.state) == new_status:
        cart.state = new_status
    elif cart.state == new_status:
        return jsonify({"message": "Order is already in this status"}), 400
    else:
        return jsonify({"error": "Invalid status transition"}), 400

    db.session.commit()
    return jsonify({"message": "Order status updated successfully", "cart": cart.serialize()}), 200

#-------------------Imagen productos---------------------

# Configuration       
cloudinary.config( 
    cloud_name = "dqs1ls601", 
    api_key = "993698731427398", 
    api_secret = "<gIUoJkVUxeDu5tIkkJb9PbD7m7M>", # Click 'View API Keys' above to copy your API secret
    secure=True
)

@api.route('/products/seller', methods=['GET'])
@jwt_required()
def get_products_by_seller():
    try:
        seller_id = get_jwt_identity()

        if not seller_id:
            return jsonify({"error": "Seller ID not found in token"}), 401

        products = Products.query.filter_by(seller_id=seller_id).all()

        if not products:
            return jsonify({"message": "No products found for this seller"}), 404

        serialized_products = [product.serialize() for product in products]

        return jsonify(serialized_products), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@api.route('/api/products/<int:product_id>/update-image', methods=['POST'])
def update_product_image(product_id):
    data = request.get_json()
    image_url = data.get('image_url')

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    product = Products.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    
    try:
        upload_result = cloudinary.uploader.upload(
            image_url,
            folder="protech_products",
            public_id=f"product_{product_id}"
        )
        product.image = upload_result["secure_url"]
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Product image updated successfully", "product": product.serialize()}), 200



@api.route('/products/<int:product_id>/image', methods=['PUT'])
@jwt_required()
def change_product_image(product_id):
    try:
        seller_id = get_jwt_identity()
        product = Products.query.filter_by(id=product_id, seller_id=seller_id).first()

        if not product:
            return jsonify({"error": "Product not found or you don't have permission to update it"}), 404

        if 'image' not in request.files:
            return jsonify({"error": "No image part in the request"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            filename = f"{product_id}_{file.filename}"
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            product.image = file_path
            db.session.commit()

            return jsonify({"message": "Product image updated successfully", "product": product.serialize()}), 200

        else:
            return jsonify({"error": "Invalid file type"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/products/image/<int:product_id>', methods=['PUT'])
def modify_product_image(product_id):
    product = Products.query.get(product_id)
    data = request.get_json()

    if 'image' in data:
        product.image = data['image']

    db.session.commit()
    return jsonify({"message": "Product successfully edited"}), 200
