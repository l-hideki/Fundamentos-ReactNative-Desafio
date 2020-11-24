import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    // TODO RETURN THE SUM OF THE PRICE FROM ALL ITEMS IN THE CART
    if (products.length > 0) {
      const arrOfPrices = products.map(item => {
        const prices = item.price * item.quantity;
        return prices;
      });

      const total = arrOfPrices.reduce((accumulator: number, price: number) => {
        // eslint-disable-next-line no-param-reassign
        accumulator += price;
        return accumulator;
      }, 0);

      return formatValue(total);
    }

    return formatValue(0);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    if (products.length > 0) {
      const arrOfQuantity = products.map(item => {
        const quantities = item.quantity;
        return quantities;
      });

      const total = arrOfQuantity.reduce(
        (accumluattor: number, quantity: number) => {
          // eslint-disable-next-line no-param-reassign
          accumluattor += quantity;
          return accumluattor;
        },
      );

      return total;
    }

    return 0;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
