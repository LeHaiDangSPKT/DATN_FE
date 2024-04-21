import { Cart, Order, Product } from "@/types/Cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Viết hàm tính tổng totalChecked và totalMoney
const calculateTotal = (cart: Cart) => {
    let totalChecked = 0;
    let totalMoney = 0;
    let listProductIdChecked: {
        id: string,
        quantity: number,
    }[] = [];
    cart.store.forEach((item) => {
        item.product.forEach((product) => {
            if (product.isChecked) {
                totalChecked += 1;
                totalMoney += product.quantity * product.newPrice;
                listProductIdChecked.push({
                    id: product.id,
                    quantity: product.quantity,
                });
            }
        });
    });
    localStorage.setItem('listProductIdChecked', JSON.stringify(listProductIdChecked));
    return { totalChecked, totalMoney };
};

export const cartPopupSlice = createSlice({
    name: "cartPopup",
    initialState: {
        items: {} as Cart,
        totalCart: 0,
        totalChecked: 0,
        totalMoney: 0,
    },
    reducers: {
        setCartPopUp: (state, action: PayloadAction<Cart>) => {
            state.items = action.payload;
            var count = 0;
            action.payload.store.map(item => {
                count += item.product.length;
            });
            state.totalCart = count;
        },
        addItemtoCartPopup: (state, action: PayloadAction<any>) => {
            const { product, store } = action.payload;
            console.log("addItemtoCartPopup", product, store, state.items)
            const index = state.items.store.findIndex((item) => item.id === store.id);
            if (index !== -1) {
                const newProduct = [...state.items.store[index].product];
                newProduct.push(product);
                state.items.store[index].product = newProduct;
            } else {
                const newProduct = [...state.items.store];
                newProduct.push({
                    id: store.id,
                    name: store.name,
                    avatar: store.avatar,
                    product: [product],
                    isChecked: store.isChecked,
                });
                state.items.store = newProduct;
            }
            state.totalCart++;
        },

        clickAll: (state, action: PayloadAction<boolean>) => {
            const isChecked = action.payload;
            state.items.isCheckAll = isChecked;
            if (action.type !== 'CLICK_ALL') {
                state.items.store.forEach((item) => {
                    item.isChecked = isChecked;
                    item.product.forEach((product) => {
                        product.isChecked = isChecked;
                    });
                });
            }
            const { totalChecked, totalMoney } = calculateTotal(state.items);
            state.totalChecked = totalChecked;
            state.totalMoney = totalMoney;

        },

        clickStore: (state, action: PayloadAction<{ storeId: string, isChecked: boolean }>) => {
            const { storeId, isChecked } = action.payload;
            const index = state.items.store.findIndex((item) => item.id === storeId);
            if (index !== -1) {
                state.items.store[index].isChecked = isChecked;
                if (action.type !== 'CLICK_STORE') {
                    state.items.store[index].product.forEach((product) => {
                        product.isChecked = isChecked;
                    });
                }
            }
            const length = state.items.store.filter((item) => item.isChecked === true).length;
            if (length === state.items.store.length) {
                cartPopupSlice.caseReducers.clickAll(state, { type: 'CLICK_ALL', payload: true });
            } else {
                cartPopupSlice.caseReducers.clickAll(state, { type: 'CLICK_ALL', payload: false });
            }
            const { totalChecked, totalMoney } = calculateTotal(state.items);
            state.totalChecked = totalChecked;
            state.totalMoney = totalMoney;
        },

        clickItem: (state, action: PayloadAction<{ productId: string, isChecked: boolean }>) => {
            const { productId, isChecked } = action.payload;
            state.items.store.forEach((item) => {
                item.product.forEach((product) => {
                    if (product.id === productId) {
                        product.isChecked = isChecked;
                    }
                });
                const length = item.product.filter((product) => product.isChecked === true).length;
                if (length === item.product.length) {
                    cartPopupSlice.caseReducers.clickStore(state, { type: 'CLICK_STORE', payload: { storeId: item.id, isChecked: true } });
                } else {
                    cartPopupSlice.caseReducers.clickStore(state, { type: 'CLICK_STORE', payload: { storeId: item.id, isChecked: false } });
                }
            });
            const { totalChecked, totalMoney } = calculateTotal(state.items);
            state.totalChecked = totalChecked;
            state.totalMoney = totalMoney;
        },

        changeQuantity: (state, action: PayloadAction<{ productId: string, iSincrease: boolean }>) => {
            const { productId, iSincrease } = action.payload;
            var price = 0
            state.items.store.forEach((item) => {
                item.product.forEach((product) => {
                    if (product.id === productId) {
                        product.quantity += iSincrease ? 1 : -1;
                        if (product.isChecked) {
                            price += iSincrease ? product.newPrice : -product.newPrice;
                        }
                    }
                });
            });
            const { totalChecked, totalMoney } = calculateTotal(state.items);
            state.totalMoney += price;
        },

        changeQuantityType: (state, action: PayloadAction<{ productId: string, quantity: number }>) => {
            const { productId, quantity } = action.payload;
            var moneyState = state.totalMoney
            state.items.store.forEach((item) => {
                item.product.forEach((product) => {
                    if (product.id === productId) {
                        if (product.isChecked) {
                            // Cập nhật vào listProductIdChecked
                            moneyState -= product.newPrice * product.quantity;
                            product.quantity = quantity;
                            moneyState += product.newPrice * quantity;
                        } else {
                            product.quantity = quantity;
                        }
                    }
                });
            });
            const { totalChecked, totalMoney } = calculateTotal(state.items);
            state.totalMoney = moneyState;

        },

        deleteProduct: (state, action: PayloadAction<{ productId: string }>) => {
            const { productId } = action.payload;
            state.items.store.forEach((item) => {
                item.product.forEach((product) => {
                    if (product.id === productId) {
                        if (product.isChecked) {
                            cartPopupSlice.caseReducers.clickItem(state, { type: 'CLICK_ITEM', payload: { productId: product.id, isChecked: false } });
                        }
                    }
                });
                item.product = item.product.filter((product) => product.id !== productId);
            });
            state.items.store = state.items.store.filter((item) => item.product.length !== 0);
            const { totalChecked, totalMoney } = calculateTotal(state.items);
            state.totalCart--;
        }
    },
})


export const { setCartPopUp, addItemtoCartPopup, clickAll, clickStore, clickItem, changeQuantity, changeQuantityType, deleteProduct } = cartPopupSlice.actions
export default cartPopupSlice.reducer