import { StateController } from "jotai-controller";

import type { User } from "@/utils/interfaces/User";

class UserController extends StateController<Partial<User>> {
    constructor() {
      super('user', {
        id: '',
        name: '',
        email: '',
        imageUrl: ''
      });
      
      this.autoSubscribeOnMethods(this);
    }
  
    login(id: string, name: string, email: string, imageUrl: string) {
      this.setState({
        id,
        name,
        email,
        imageUrl,
      });
    }
  
    logout() {
      this.setState({
        id: '',
        name: '',
        email: '',
        imageUrl: ''
      });
    }
  }


  export const userController = new UserController();