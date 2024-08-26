import styles from './MenuPrincipal.module.css';

const MenuPrincipal = ({ menuData }) => {
  const renderMenu = (menuItems) => {
    return (
      <ul className={styles.menu}>
        {menuItems.map((menuItem, index) => (
          <li key={index}>
            <span className={styles.menuItem}>{menuItem.nombre}</span>
            {menuItem.subMenus && menuItem.subMenus.length > 0 && (
              <div className={styles.submenu}>
                {renderMenu(menuItem.subMenus)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const topMenuItems = menuData.filter(item => !item.idPadre);

  return (
    <nav>
      {renderMenu(topMenuItems)}
    </nav>
  );
};

export default MenuPrincipal;
