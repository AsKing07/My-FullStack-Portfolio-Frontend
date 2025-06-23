export interface MenuItem {
  title: string;
  href: string;
  icon?: React.ComponentType<any>;
  external?: boolean;
}