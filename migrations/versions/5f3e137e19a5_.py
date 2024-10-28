"""empty message

Revision ID: 5f3e137e19a5
Revises: 
Create Date: 2024-10-27 23:37:50.782281
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '5f3e137e19a5'
down_revision = None  # Cambiar esto a None o a la revisión anterior adecuada
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categoria',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comprador',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('clave', sa.String(length=80), nullable=False),
        sa.Column('telefono', sa.String(length=80), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('direccion',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('direccion', sa.String(length=120), nullable=False),
        sa.Column('ciudad', sa.String(length=120), nullable=False),
        sa.Column('codigo_postal', sa.String(length=80), nullable=False),
        sa.Column('pais', sa.String(length=80), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('seller',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('password', sa.String(length=80), nullable=False),
        sa.Column('phone', sa.String(length=80), nullable=False),
        sa.Column('bank_account', sa.String(length=80), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_table('user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('password', sa.String(length=80), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_table('cart',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('state', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.Date(), nullable=False),
        sa.Column('total_price', sa.Integer(), nullable=False),
        sa.Column('comprador_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['comprador_id'], ['comprador.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('description', sa.String(length=400), nullable=False),
        sa.Column('price', sa.Integer(), nullable=False),
        sa.Column('stock', sa.Integer(), nullable=False),
        sa.Column('image', sa.String(length=500), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['categoria.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('item_cart',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('cart_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['cart_id'], ['cart.id'], ),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('item_cart')
    op.drop_table('products')
    op.drop_table('cart')
    op.drop_table('user')
    op.drop_table('seller')
    op.drop_table('direccion')
    op.drop_table('comprador')
    op.drop_table('categoria')
    # ### end Alembic commands ###
