import "./HeaderBlock.styles.css";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../common/constants/frontend-routes.constants";
import { observer } from "mobx-react-lite";
import { Dropdown, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import useMobx from "../../stores/root-store";

const HeaderBlock = observer(() => {
  const { modalsStore, usersStore } = useMobx();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(FRONTEND_ROUTES.BASE);
  };

  const handleLogout = async () => {
    await usersStore.logout();
    navigate(FRONTEND_ROUTES.MAIN.LOGIN);
  };

  const handleDeleteAccount = async () => {
    modalsStore.setConfirmationModal(
      "confirmation",
      async () => {
        await usersStore.deleteAccount();
        navigate(FRONTEND_ROUTES.MAIN.REGISTRATION);
        modalsStore.setConfirmationModal("confirmation");
      },
      `Are you sure you want to delete your account?`,
      "Delete account"
    );
  };

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={handleLogout}>
          Logout
        </a>
      ),
    },
    {
      key: "deleteAccount",
      danger: true,
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={handleDeleteAccount}>
          Delete account
        </a>
      ),
    },
  ];

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        Filmio
      </div>
      {usersStore.getIsUserLoggedIn() ? (
        <Dropdown menu={{ items }} placement="bottomRight">
          <a onClick={(e) => e.preventDefault()} className="user-menu">
            <Space>
              {usersStore.getUser().fullName}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      ) : (
        <></>
      )}
    </header>
  );
});

export default HeaderBlock;
