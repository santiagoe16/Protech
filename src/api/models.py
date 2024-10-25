from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    description = db.Column(db.String(400), unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)
    stock = db.Column(db.Integer, unique=False, nullable=False)
    image = db.Column(db.String(500), unique=False, nullable=False)

    def __repr__(self):
        return f'<Products {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "image": self.image,
        }
    
class Categoria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    
    # Representación del objeto
    def __repr__(self):
        return f'<Categoria {self.name}>'

    # Método para serializar el objeto
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }


    # Método para serializar los datos de la categoría

class Seller(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    phone = db.Column(db.String(80), unique=False, nullable=False)
    bank_account = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Seller {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "phone" : self.phone,
            "bank_account": self.bank_account,
        }
    
class Comprador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=False, nullable=False)
    clave = db.Column(db.String(80), unique=False, nullable=False)
    telefono = db.Column(db.String(80), unique=False, nullable=False)
    carts = db.relationship('Cart', backref='comprador', lazy=True)
        
     
        # Representación del objeto
    def __repr__(self):
        return f'<Comprador {self.name} '

    # Método para serializar los datos del comprador
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "clave": self.clave,
            "telefono": self.telefono
        }

class ItemCart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, unique=False, nullable=False)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

    def __repr__(self):
        return f'<ItemCart {self.amount}>'

    def serialize(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "cart_id": self.cart_id,
            "product_id": self.product_id
        }

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comprador_id = db.Column(db.Integer, db.ForeignKey('comprador.id'), nullable=False)
    state = db.Column(db.String(20), unique=False, nullable=False)
    created_at = db.Column(db.Date, default=date.today, unique=False, nullable=False)
    total_price = db.Column(db.Integer, unique=False, nullable=False)
    items = db.relationship('ItemCart', backref='cart', lazy=True)

    def __repr__(self):
        return f'<Products {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "state": self.state,
            "created_at": self.created_at.strftime('%Y-%m-%d'),
            "total_price": self.total_price,
            "comprador_id": self.comprador_id
        }
    
class Direccion (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    direccion = db.Column(db.String(120), unique=False, nullable=False)
    ciudad= db.Column(db.String(120), unique=False, nullable=False)
    codigo_postal = db.Column(db.String(80), unique=False, nullable=False)
    pais = db.Column(db.String(80), unique=False, nullable=False)
        
     
    def __repr__(self):
        return f'<Address {self.name} '

   
    def serialize(self):
        return {
            "id": self.id,
            "direccion": self.direccion,
            "ciudad": self.ciudad,
            "codigo_postal": self.codigo_postal,
            "pais": self.pais,
        }
