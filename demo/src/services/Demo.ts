import Constants from '@common/Constants';
import Types from '@types';

/**
  * Demo service.
  */
export default class DemoService {
  public getHealthStatus = (): Types.HealthResponseDTO => ({
    message: 'Server is running',
    version: Constants.VERSION
  });
}
