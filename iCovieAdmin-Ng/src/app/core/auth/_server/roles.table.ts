
export class RolesTable {
  // public  roles: any[];

  constructor() {
    // this.roles =  this.auth.getRoleCollection().subscribe();	
    // this.roles =  this.auth.getRoleCollection().subscribe();
  }

  public static roles: any = [
    {
      id: 1,
      title: 'Administrator',
      isCoreRole: true,
      permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    {
      id: 2,
      title: 'Manager',
      isCoreRole: false,
      permissions: [3, 4, 10]
    },
    {
      id: 3,
      title: 'Guest',
      isCoreRole: false,
      permissions: []
    }
  ];


}
