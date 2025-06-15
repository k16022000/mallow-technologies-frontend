import React from "react"
import styles from "./styles/CoreAssets.module.scss";
import { getAcronym, stringToDarkHex } from "@utils/helpers";
import { Box, Button, Card, Icon, Typography } from "@mui/material";
import { ArrowBack, Menu, MenuOpen } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { InnerSideNavItem } from "@utils/types";
import { useTranslation } from "react-i18next";

interface AvatarProps {
  src: string;
  alt: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src = '', alt = '' }) => {
  return (
    <div className={styles.logo}>
      {src ? (
        <img alt={alt} src={src} className={styles.logoImage} />
      ) : (
        <div
          className={styles.logoText}
          style={{ backgroundColor: stringToDarkHex(getAcronym(alt)) }}
        >
          {getAcronym(alt)}
        </div>
      )}
    </div>
  )
}

interface BackButtonProps {
  onClick?: () => void;
  text?: string;
}

export const BackButton: React.FC<BackButtonProps> = (props) => {
  const navigate = useNavigate();

  const {
    onClick = () => navigate(-1),
    text = "Back",
  } = props;

  return (
    <Button className={styles.backButton} onClick={onClick}>
      <ArrowBack />
      <span>{text}</span>
    </Button>
  )
}

interface InnerSideNavProps<Item> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  navItemList: Item[];
  activeItem: string;
  onClickItem: (item: Item) => void;
}

export const InnerSideNav: React.FC<InnerSideNavProps<InnerSideNavItem>> = (props) => {
  const {
    isCollapsed,
    setIsCollapsed,
    navItemList,
    activeItem,
    onClickItem,
  } = props;

  const { t } = useTranslation();

  return (
    <Card className={styles.InnerSideNav}>
      <Box className={styles.collapseContainer}>
        <Icon onClick={() => setIsCollapsed((prev) => !prev)} sx={{ cursor: 'pointer' }}>
          {isCollapsed ? <MenuOpen /> : <Menu />}
        </Icon>
      </Box>

      <Box className={`${styles.navList} ${isCollapsed ? styles.collapsedList : ''}`}>
        {navItemList.map((item) => {
          const { icon, label, href } = item;

          return (
            <Box
              className={styles.listItem}
              key={`item-${label}`}
            >
              <Typography
                component="a"
                href={href ? `#${href}` : undefined}
                variant="body2"
                onClick={() => onClickItem(item)}
                className={activeItem === label ? styles.activeItem : ""}
              >
                <Box>{icon}</Box>
                <Box>{t(label)}</Box>
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Card>
  )
}