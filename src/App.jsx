import Autocomplete from "./Component/Autocomplete";
import ProductTemplate from "./ProductTemplate";

const searchUser = async (term) => {
  let result = await fetch(`http://localhost:3000/user/1`, {
    method: "POST",
    body: JSON.stringify({ terms: [term] }),
    headers: { "Content-Type": "application/json" }
  });
  let data = await result.json();
  return data.data.map(user => ({
    ...user,
    type: "user",
    icon: "faUser",
    label: `${user.firstName} ${user.lastName}`
  }));
};

const searchProduct = async (term) => {
  let result = await fetch(`http://localhost:3000/product/1`, {
    method: "POST",
    body: JSON.stringify({ terms: [term] }),
    headers: { "Content-Type": "application/json" }
  });
  let data = await result.json();
  return data.data.map(product => ({
    ...product,
    type: "product",
    icon: "faBox",
    label: product.name,
    price: product.price,
  }));
};

const searchMixed = async (term) => {
  const [userResults, productResults] = await Promise.all([searchUser(term), searchProduct(term)]);
  return [...userResults, ...productResults];
};

const select = (value) => {
  console.log("Élément sélectionné:", value);
};

export default function App() {
  return (
    <div>
      <h2>1. Autocomplete user simple avec data en props</h2>
      <Autocomplete
        search={searchUser}
        onSelect={select}
        multiple={false}
        placeholder="Recherchez un utilisateur..."
      />

      <h2>2. Autocomplete user simple avec data en fonction</h2>
      <Autocomplete
        search={searchUser}
        onSelect={select}
        multiple={false}
        placeholder="Recherchez un utilisateur (fonction)..."
      />

      <h2>3. Autocomplete user multiple avec data en fonction</h2>
      <Autocomplete
        search={searchUser}
        onSelect={select}
        multiple={true}
        placeholder="Recherchez plusieurs utilisateurs..."
      />

      <h2>4. Autocomplete product simple avec data en fonction</h2>
      <Autocomplete
        search={searchProduct}
        onSelect={select}
        multiple={false}
        placeholder="Recherchez un produit..."
      />

      <h2>5. Autocomplete product multiple avec data en fonction (dynamique)</h2>
      <Autocomplete
        search={searchProduct}
        onSelect={select}
        multiple={true}
        placeholder="Recherchez plusieurs produits..."
      />

      <h2>6. Autocomplete mix multiple avec data en fonction (dynamique)</h2>
      <Autocomplete
        search={searchMixed}
        onSelect={(selectedItem) => console.log("Élément sélectionné dans mix :", selectedItem)}
        multiple={true}
        placeholder="Recherchez des utilisateurs ou des produits..."
      />

      <h2>7. Autocomplete product multiple avec template et data en fonction (dynamique)</h2>
      <Autocomplete
        search={searchMixed}
        onSelect={select}
        multiple={true}
        template={ProductTemplate}
        placeholder="Recherchez des produits (avec template)..."
      />

      <h2>8. Autocomplete product simple suggestion au lieu d'une liste</h2>
      <Autocomplete
        search={searchProduct}
        onSelect={select}
        multiple={false}
        placeholder="Suggestions de produit (simple)..."
      />
    </div>
  );
}
