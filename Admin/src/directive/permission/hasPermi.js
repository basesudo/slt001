/*
 * @Autor: Aka
 * @Date: 2023-08-04 14:28:13
 * @Description:
 * @LastEditTime: 2023-08-21 15:22:23
 */
/**
 * v-hasPermi 操作权限处理
 */

import store from "@/store";

export default {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const all_permission = "*:*:*";
    const permissions = store.getters && store.getters.permissions;

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;

      const hasPermissions = permissions.some((permission) => {
        return (
          all_permission === permission || permissionFlag.includes(permission)
        );
      });
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  },
};
